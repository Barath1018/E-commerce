import { useEffect, useMemo, useState } from 'react';
import {
	BarChart3,
	CheckCircle2,
	Crown,
	FileBox,
	Image as ImageIcon,
	Layers,
	Pencil,
	Plus,
	Sparkles,
	ShieldCheck,
	ShoppingBag,
	Star,
	Tag,
	Trash2,
	UploadCloud,
	X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStore } from '../store/orderStore';
import { CatalogProduct, ProductFile, useProductCatalog } from '../store/catalogStore';
import { supabase } from '../supabase/client';

const emptyForm = {
	name: '',
	description: '',
	shortDescription: '',
	price: '',
	category: '',
	tags: '',
	thumbnailUrl: '',
	previewImages: '',
	licenseType: 'standard' as CatalogProduct['licenseType'],
	featured: false,
	bestSeller: false,
	uniqueCodeEnabled: false,
	uniqueCodePrefix: 'AESTHIFY',
	reviewsEnabled: true,
};

const inputClass =
	'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 transition focus:border-emerald-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/20';

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60';

function StatCard({
	icon: Icon,
	label,
	value,
	tint,
	glow,
}: {
	icon: typeof ShoppingBag;
	label: string;
	value: string | number;
	tint: string;
	glow: string;
}) {
	return (
		<div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]">
			<div
				className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full ${glow} opacity-30 blur-3xl transition group-hover:opacity-50`}
			/>
			<div className="relative flex items-center gap-4">
				<div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint} ring-1 ring-white/10`}>
					<Icon className="h-5 w-5 text-white" />
				</div>
				<div>
					<div className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">{label}</div>
					<div className="mt-0.5 text-2xl font-semibold tracking-tight text-white">{value}</div>
				</div>
			</div>
		</div>
	);
}

function SectionHeader({
	icon: Icon,
	title,
	description,
}: {
	icon: typeof Layers;
	title: string;
	description?: string;
}) {
	return (
		<div className="mb-5 flex items-start gap-3 border-b border-white/5 pb-4">
			<div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/20 to-emerald-600/10 ring-1 ring-emerald-400/20">
				<Icon className="h-4 w-4 text-emerald-300" />
			</div>
			<div>
				<h3 className="text-base font-semibold text-white">{title}</h3>
				{description && <p className="mt-0.5 text-xs text-white/50">{description}</p>}
			</div>
		</div>
	);
}

function ToggleCard({
	checked,
	onChange,
	icon: Icon,
	label,
	description,
}: {
	checked: boolean;
	onChange: (value: boolean) => void;
	icon: typeof Crown;
	label: string;
	description?: string;
}) {
	return (
		<button
			type="button"
			onClick={() => onChange(!checked)}
			className={`group relative flex items-start gap-3 rounded-xl border p-4 text-left transition ${
				checked
					? 'border-emerald-400/40 bg-emerald-400/[0.06] shadow-[0_0_0_1px_rgba(52,211,153,0.15)_inset]'
					: 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
			}`}
		>
			<div
				className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition ${
					checked ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/5 text-white/50'
				}`}
			>
				<Icon className="h-4 w-4" />
			</div>
			<div className="flex-1 pr-8">
				<div className="text-sm font-medium text-white">{label}</div>
				{description && <div className="mt-0.5 text-xs text-white/50">{description}</div>}
			</div>
			<div
				className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition ${
					checked
						? 'border-emerald-400 bg-emerald-400 text-gray-950'
						: 'border-white/20 bg-transparent'
				}`}
			>
				{checked && <CheckCircle2 className="h-3.5 w-3.5" />}
			</div>
		</button>
	);
}

function AdminPortal() {
	const products = useProductCatalog((state) => state.products);
	const addProduct = useProductCatalog((state) => state.addProduct);
	const updateProduct = useProductCatalog((state) => state.updateProduct);
	const deleteProduct = useProductCatalog((state) => state.deleteProduct);
	const fetchProducts = useProductCatalog((state) => state.fetchProducts);
	const orders = useOrderStore((state) => state.orders);
	const fetchAllOrders = useOrderStore((state) => state.fetchAllOrders);
	const [form, setForm] = useState(emptyForm);
	const [uploadedFiles, setUploadedFiles] = useState<ProductFile[]>([]);
	const [editingProductId, setEditingProductId] = useState<string | null>(null);
	const [thumbnailBroken, setThumbnailBroken] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		fetchProducts();
		fetchAllOrders();
	}, [fetchProducts, fetchAllOrders]);

	const totalUsers = useMemo(
		() => new Set(orders.map((order) => order.userId)).size,
		[orders]
	);

	const totalRevenue = useMemo(
		() => orders.reduce((sum, order) => sum + order.total, 0),
		[orders]
	);

	const resetForm = () => {
		setForm(emptyForm);
		setUploadedFiles([]);
		setEditingProductId(null);
		setThumbnailBroken(false);
	};

	const startNewProduct = () => {
		resetForm();
	};

	const cancelEditing = () => {
		resetForm();
	};

	const uploadToStorage = async (file: File, bucket: string): Promise<{ url: string; path: string } | null> => {
		const ext = file.name.split('.').pop();
		const path = `${bucket}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

		const { error } = await supabase.storage
			.from(bucket)
			.upload(path, file, { cacheControl: '3600', upsert: false });

		if (error) {
			console.error('Upload error:', error);
			return null;
		}

		const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
		return { url: urlData.publicUrl, path };
	};

	const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const result = await uploadToStorage(file, 'product-thumbnails');
			if (result) {
				setForm((current) => ({ ...current, thumbnailUrl: result.url }));
				toast.success('Thumbnail uploaded.');
			} else {
				toast.error('Failed to upload thumbnail.');
			}
		} finally {
			setUploading(false);
			event.target.value = '';
		}
	};

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		setUploading(true);
		try {
			for (const file of files) {
				const result = await uploadToStorage(file, 'product-files');
				if (result) {
					setUploadedFiles((current) => [
						...current,
						{
							name: file.name,
							size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
							type: file.type || 'application/octet-stream',
							url: result.url,
							source: 'upload' as const,
							storage_path: result.path,
						},
					]);
				}
			}
			toast.success(`${files.length} file(s) uploaded.`);
		} finally {
			setUploading(false);
			event.target.value = '';
		}
	};

	const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
		event.preventDefault();
		setIsDragging(false);
		const files = Array.from(event.dataTransfer.files ?? []);
		if (files.length > 0) {
			setUploading(true);
			try {
				for (const file of files) {
					const result = await uploadToStorage(file, 'product-files');
					if (result) {
						setUploadedFiles((current) => [
							...current,
							{
								name: file.name,
								size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
								type: file.type || 'application/octet-stream',
								url: result.url,
								source: 'upload' as const,
								storage_path: result.path,
							},
						]);
					}
				}
				toast.success(`${files.length} file(s) uploaded.`);
			} finally {
				setUploading(false);
			}
		}
	};

	const removeUploadedFile = (index: number) => {
		setUploadedFiles((current) => current.filter((_, i) => i !== index));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const parsedPrice = Number(form.price);
		if (!form.name.trim() || !form.category.trim()) {
			toast.error('Name and category are required.');
			return;
		}

		if (!form.thumbnailUrl.trim() && !editingProductId) {
			toast.error('Thumbnail is required.');
			return;
		}

		try {
			const nextProduct = {
				id: editingProductId ?? undefined,
				name: form.name.trim(),
				description: form.description.trim(),
				shortDescription: form.shortDescription.trim(),
				price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
				isFree: form.licenseType === 'free',
				category: form.category.trim(),
				tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
				thumbnailUrl: form.thumbnailUrl.trim(),
				previewImages: form.previewImages.split('\n').map((item) => item.trim()).filter(Boolean),
				files: uploadedFiles,
				licenseType: form.licenseType,
				reviewsEnabled: form.reviewsEnabled,
				isFeatured: form.featured,
				isBestSeller: form.bestSeller,
				uniqueCodeEnabled: form.uniqueCodeEnabled,
				uniqueCodePrefix: form.uniqueCodePrefix.trim() || 'AESTHIFY',
				downloadCount: editingProductId
					? products.find((product) => product.id === editingProductId)?.downloadCount ?? 0
					: 0,
			};

			if (editingProductId) {
				await updateProduct(editingProductId, nextProduct);
				toast.success('Product updated.');
			} else {
				await addProduct(nextProduct);
				toast.success('Product added.');
			}

			resetForm();
		} catch (err: any) {
			toast.error(err.message || 'Failed to save product.');
		}
	};

	const startEditing = (product: CatalogProduct) => {
		setEditingProductId(product.id);
		setForm({
			name: product.name,
			description: product.description,
			shortDescription: product.shortDescription ?? '',
			price: String(product.price),
			category: product.category,
			tags: product.tags.join(', '),
			thumbnailUrl: product.thumbnailUrl,
			previewImages: product.previewImages.join('\n'),
			licenseType: product.licenseType,
			featured: Boolean(product.isFeatured),
			bestSeller: Boolean(product.isBestSeller),
			uniqueCodeEnabled: Boolean(product.uniqueCodeEnabled),
			uniqueCodePrefix: product.uniqueCodePrefix ?? 'AESTHIFY',
			reviewsEnabled: product.reviewsEnabled ?? true,
		});
		setUploadedFiles(product.files);
		setThumbnailBroken(false);
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const handleDelete = async (productId: string) => {
		if (!confirm('Are you sure you want to delete this product?')) return;
		try {
			await deleteProduct(productId);
			toast.success('Product deleted.');
		} catch (err: any) {
			toast.error(err.message || 'Failed to delete product.');
		}
	};

	return (
		<div className="mx-auto max-w-7xl space-y-8 pb-12 text-white">
			{/* HERO */}
			<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 via-gray-900 to-black p-8 shadow-2xl md:p-10">
				<div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
				<div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px]" />
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.04]"
					style={{
						backgroundImage:
							'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
						backgroundSize: '32px 32px',
					}}
				/>

				<div className="relative flex flex-wrap items-start justify-between gap-8">
					<div className="max-w-2xl">
						<div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 backdrop-blur">
							<ShieldCheck className="h-3.5 w-3.5" />
							Admin · Control Center
						</div>
						<h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
							<span className="bg-gradient-to-r from-white via-white to-emerald-200 bg-clip-text text-transparent">
								Curate. Configure. Convert.
							</span>
						</h1>
						<p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
							Manage your premium catalog, attach assets, set licensing tiers, and issue unique
							access codes — all from one refined workspace.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3 text-sm">
						<div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
							<div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Products</div>
							<div className="mt-1 text-3xl font-semibold text-white">{products.length}</div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur">
							<div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Orders</div>
							<div className="mt-1 text-3xl font-semibold text-white">{orders.length}</div>
						</div>
					</div>
				</div>
			</section>

			{/* STAT GRID */}
			<section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard
					icon={ShoppingBag}
					label="Customers"
					value={totalUsers}
					tint="bg-gradient-to-br from-blue-500/30 to-blue-600/10"
					glow="bg-blue-500"
				/>
				<StatCard
					icon={ShoppingBag}
					label="Orders"
					value={orders.length}
					tint="bg-gradient-to-br from-emerald-500/30 to-emerald-600/10"
					glow="bg-emerald-500"
				/>
				<StatCard
					icon={BarChart3}
					label="Revenue"
					value={`₹${totalRevenue.toFixed(2)}`}
					tint="bg-gradient-to-br from-violet-500/30 to-purple-600/10"
					glow="bg-violet-500"
				/>
				<StatCard
					icon={Sparkles}
					label="Live Catalog"
					value={products.length}
					tint="bg-gradient-to-br from-amber-400/30 to-orange-500/10"
					glow="bg-amber-400"
				/>
			</section>

			{/* FORM + CATALOG */}
			<section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.15fr_0.85fr]">
				{/* PRODUCT FORM */}
				<form
					onSubmit={handleSubmit}
					className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-xl backdrop-blur-xl md:p-8"
				>
					<div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-6">
						<div>
							<div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-300">
								<span className="h-1 w-1 rounded-full bg-emerald-400" />
								{editingProductId ? 'Edit mode' : 'New product'}
							</div>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
								{editingProductId ? 'Refine product details' : 'Add a new product'}
							</h2>
							<p className="mt-1 text-sm text-white/50">
								Saved products flow into the storefront in real-time.
							</p>
						</div>
						<button
							type="button"
							onClick={resetForm}
							className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
						>
							Reset form
						</button>
					</div>

					{/* SECTION: Basics */}
					<div className="mb-8">
						<SectionHeader
							icon={Layers}
							title="Basics"
							description="Essential info that appears on the product page."
						/>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="md:col-span-2">
								<label className={labelClass}>Product name</label>
								<input
									className={inputClass}
									placeholder="e.g. Motion Graphics Bundle"
									value={form.name}
									onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
								/>
							</div>
							<div>
								<label className={labelClass}>Category</label>
								<input
									className={inputClass}
									placeholder="e.g. Video Effects"
									value={form.category}
									onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
								/>
							</div>
							<div>
								<label className={labelClass}>License type</label>
								<select
									className={inputClass}
									value={form.licenseType}
									onChange={(e) =>
										setForm((current) => ({
											...current,
											licenseType: e.target.value as CatalogProduct['licenseType'],
										}))
									}
								>
									<option className="bg-gray-900" value="free">Free</option>
									<option className="bg-gray-900" value="standard">Standard</option>
									<option className="bg-gray-900" value="extended">Extended</option>
									<option className="bg-gray-900" value="exclusive">Exclusive</option>
								</select>
							</div>
							<div className="md:col-span-2">
								<label className={labelClass}>Short description</label>
								<input
									className={inputClass}
									placeholder="One-line summary that appears on cards"
									value={form.shortDescription}
									onChange={(e) =>
										setForm((current) => ({ ...current, shortDescription: e.target.value }))
									}
								/>
							</div>
							<div className="md:col-span-2">
								<label className={labelClass}>
									<span className="inline-flex items-center gap-1.5">
										<Tag className="h-3 w-3" />
										Tags
									</span>
								</label>
								<input
									className={inputClass}
									placeholder="comma, separated, tags"
									value={form.tags}
									onChange={(e) => setForm((current) => ({ ...current, tags: e.target.value }))}
								/>
							</div>
						</div>
					</div>

					{/* SECTION: Media */}
					<div className="mb-8">
						<SectionHeader
							icon={ImageIcon}
							title="Media"
							description="Thumbnail and preview gallery."
						/>
						<div className="grid grid-cols-1 gap-4">
							<div>
								<label className={labelClass}>Thumbnail</label>
								<div className="flex gap-2">
									<input
										className={`${inputClass} flex-1`}
										placeholder="https://… or upload below"
										value={form.thumbnailUrl}
										onChange={(e) => {
											setThumbnailBroken(false);
											setForm((current) => ({ ...current, thumbnailUrl: e.target.value }));
										}}
									/>
									<label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70 transition hover:border-emerald-400/40 hover:text-emerald-300">
										<UploadCloud className="h-4 w-4" />
										<input
											type="file"
											accept="image/*"
											className="sr-only"
											onChange={handleThumbnailUpload}
										/>
										{uploading ? 'Uploading…' : 'Upload'}
									</label>
								</div>
								{form.thumbnailUrl && !thumbnailBroken && (
									<div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
										<img
											src={form.thumbnailUrl}
											alt="Thumbnail preview"
											className="h-40 w-full object-cover"
											onError={() => setThumbnailBroken(true)}
										/>
									</div>
								)}
							</div>
							<div>
								<label className={labelClass}>Preview image URLs</label>
								<textarea
									className={`${inputClass} resize-none`}
									rows={3}
									placeholder="One URL per line"
									value={form.previewImages}
									onChange={(e) =>
										setForm((current) => ({ ...current, previewImages: e.target.value }))
									}
								/>
							</div>
						</div>
					</div>

					{/* SECTION: Pricing */}
					<div className="mb-8">
						<SectionHeader
							icon={BarChart3}
							title="Pricing"
							description="Numbers that determine sale."
						/>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div>
								<label className={labelClass}>Price (INR)</label>
								<input
									className={inputClass}
									placeholder="499"
									type="number"
									min="0"
									step="0.01"
									value={form.price}
									onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
									disabled={form.licenseType === 'free'}
								/>
								{form.licenseType === 'free' && (
									<p className="mt-1 text-xs text-emerald-400">Price is set to ₹0 for free products.</p>
								)}
							</div>
							<div>
								<label className={labelClass}>Access code prefix</label>
								<input
									className={inputClass}
									placeholder="AESTHIFY"
									value={form.uniqueCodePrefix}
									onChange={(e) =>
										setForm((current) => ({ ...current, uniqueCodePrefix: e.target.value }))
									}
								/>
							</div>
						</div>
					</div>

					{/* SECTION: Flags */}
					<div className="mb-8">
						<SectionHeader
							icon={Crown}
							title="Visibility & access"
							description="Highlight and protect your product."
						/>
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<ToggleCard
								checked={form.featured}
								onChange={(value) => setForm((c) => ({ ...c, featured: value }))}
								icon={Sparkles}
								label="Featured product"
								description="Show on the homepage featured rail."
							/>
							<ToggleCard
								checked={form.bestSeller}
								onChange={(value) => setForm((c) => ({ ...c, bestSeller: value }))}
								icon={Crown}
								label="Best seller"
								description="Adds a bestseller badge on cards."
							/>
							<ToggleCard
								checked={form.uniqueCodeEnabled}
								onChange={(value) => setForm((c) => ({ ...c, uniqueCodeEnabled: value }))}
								icon={ShieldCheck}
								label="Unique purchase code"
								description="Issue a long access code with every order."
							/>
							<ToggleCard
								checked={form.reviewsEnabled}
								onChange={(value) => setForm((c) => ({ ...c, reviewsEnabled: value }))}
								icon={Star}
								label="Reviews & ratings"
								description="Allow users to leave reviews and ratings."
							/>
						</div>
					</div>

					{/* SECTION: Files */}
					<div className="mb-8">
						<SectionHeader
							icon={FileBox}
							title="Product assets"
							description="Files attached to the product record."
						/>
						<label
							htmlFor="admin-file-upload"
							onDragOver={(e) => {
								e.preventDefault();
								if (!isDragging) setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
							className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition ${
								isDragging
									? 'border-emerald-400/60 bg-emerald-400/[0.06]'
									: 'border-white/15 bg-white/[0.02] hover:border-emerald-400/40 hover:bg-emerald-400/[0.03]'
							}`}
						>
							<UploadCloud className="mb-3 h-8 w-8 text-white/40 transition group-hover:text-emerald-300" />
							<div className="text-sm font-medium text-white">
								Click to upload <span className="text-white/40">or drag &amp; drop</span>
							</div>
							<div className="mt-1 text-xs text-white/40">
								Any file type — just drag &amp; drop.
							</div>
							<input
								id="admin-file-upload"
								type="file"
								multiple
								accept="*/*"
								onChange={handleFileUpload}
								className="sr-only"
							/>
						</label>

						{uploadedFiles.length > 0 && (
							<div className="mt-4 space-y-2">
								<div className="text-xs font-medium uppercase tracking-wider text-white/50">
									{uploadedFiles.length} file{uploadedFiles.length === 1 ? '' : 's'} attached
								</div>
								<ul className="space-y-2">
									{uploadedFiles.map((file, index) => (
										<li
											key={`${file.name}-${index}`}
											className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5"
										>
											<div className="flex min-w-0 items-center gap-3">
												<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
													<FileBox className="h-4 w-4" />
												</div>
												<div className="min-w-0">
													<div className="truncate text-sm text-white">{file.name}</div>
													<div className="text-xs text-white/40">{file.size} · {file.type}</div>
												</div>
											</div>
											<button
												type="button"
												onClick={() => removeUploadedFile(index)}
												className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/10 hover:text-red-400"
												aria-label="Remove file"
											>
												<X className="h-4 w-4" />
											</button>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* ACTIONS */}
					<div className="flex flex-wrap items-center gap-3 border-t border-white/5 pt-6">
						<button
							type="submit"
							disabled={uploading}
							className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-500/20 transition hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110 active:brightness-95 disabled:opacity-50"
						>
							<Plus className="h-4 w-4" />
							{editingProductId ? 'Update product' : 'Add product'}
						</button>
						{editingProductId && (
							<>
								<button
									type="button"
									onClick={cancelEditing}
									className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={startNewProduct}
									className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] px-5 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/[0.14]"
								>
									+ Add new product
								</button>
							</>
						)}
						<span className="ml-auto text-xs text-white/40">
							Timestamps are written automatically.
						</span>
					</div>
				</form>

				{/* CATALOG */}
				<div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-xl backdrop-blur-xl md:p-8">
					<div className="mb-6 flex items-center justify-between gap-4 border-b border-white/5 pb-5">
						<div>
							<div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-300">
								<span className="h-1 w-1 rounded-full bg-emerald-400" />
								Catalog
							</div>
							<h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
								Live products
							</h2>
						</div>
						<div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/70">
							{products.length} total
						</div>
					</div>

					{products.length === 0 ? (
						<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center">
							<Layers className="mb-3 h-8 w-8 text-white/30" />
							<div className="text-sm font-medium text-white">No products yet</div>
							<div className="mt-1 text-xs text-white/50">Add your first product on the left.</div>
						</div>
					) : (
						<div className="space-y-3">
							{products.map((product) => (
								<article
									key={product.id}
									className={`group relative overflow-hidden rounded-2xl border p-4 transition ${
										editingProductId === product.id
											? 'border-emerald-400/40 bg-emerald-400/[0.04]'
											: 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
									}`}
								>
									<div className="flex items-start gap-4">
										<div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
											{product.thumbnailUrl ? (
												<img
													src={product.thumbnailUrl}
													alt={product.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).style.display = 'none';
													}}
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center text-white/30">
													<ImageIcon className="h-5 w-5" />
												</div>
											)}
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-start justify-between gap-2">
												<div className="min-w-0">
													<div className="flex items-center gap-2">
														<h3 className="truncate text-sm font-semibold text-white">
															{product.name}
														</h3>
													</div>
													<div className="mt-0.5 text-xs text-white/50">
														{product.category} · {product.licenseType === 'free' ? 'Free' : `₹${product.price}`}
													</div>
												</div>
												<div className="flex gap-1.5">
													<button
														onClick={() => startEditing(product)}
														className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
													>
														<Pencil className="h-3 w-3" />
														Edit
													</button>
													<button
														onClick={() => handleDelete(product.id)}
														className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/20 bg-red-400/[0.05] px-3 py-1.5 text-xs font-medium text-red-300/70 transition hover:border-red-400/40 hover:bg-red-400/[0.1] hover:text-red-300"
													>
														<Trash2 className="h-3 w-3" />
													</button>
												</div>
											</div>

											{/* Badges */}
											<div className="mt-2 flex flex-wrap gap-1.5">
												{product.isFeatured && (
													<span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
														<Sparkles className="h-2.5 w-2.5" /> Featured
													</span>
												)}
												{product.isBestSeller && (
													<span className="inline-flex items-center gap-1 rounded-full border border-rose-400/30 bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
														<Crown className="h-2.5 w-2.5" /> Bestseller
													</span>
												)}
												{product.uniqueCodeEnabled && (
													<span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
														<ShieldCheck className="h-2.5 w-2.5" /> Code
													</span>
												)}
												{product.licenseType === 'free' && (
													<span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
														Free
													</span>
												)}
												{product.reviewsEnabled && (
													<span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
														<Star className="h-2.5 w-2.5" /> Reviews
													</span>
												)}
												<span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/60">
													{product.licenseType}
												</span>
											</div>

											{/* Mini-stats */}
											<div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
												<div className="rounded-lg bg-white/[0.03] px-2 py-1.5">
													<div className="text-white/40">Downloads</div>
													<div className="mt-0.5 font-medium text-white">
														{product.downloadCount ?? 0}
													</div>
												</div>
												<div className="rounded-lg bg-white/[0.03] px-2 py-1.5">
													<div className="text-white/40">Rating</div>
													<div className="mt-0.5 flex items-center gap-1 font-medium text-white">
														{(product.ratings ?? 0) > 0 ? (
															<>
																<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
																{(product.ratings ?? 0).toFixed(1)}
															</>
														) : (
															<span className="text-white/40">—</span>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

export default AdminPortal;
