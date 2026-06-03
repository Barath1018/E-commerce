/// <reference types="vite/client" />

interface RazorpayOptions {
	key: string;
	amount: number;
	currency: string;
	name: string;
	description?: string;
	image?: string;
	handler: (response: unknown) => void;
	prefill?: {
		name?: string;
		email?: string;
		contact?: string;
	};
	notes?: Record<string, string>;
	theme?: {
		color?: string;
	};
	modal?: {
		ondismiss?: () => void;
	};
}

interface RazorpayInstance {
	open: () => void;
}

interface Window {
	Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}
