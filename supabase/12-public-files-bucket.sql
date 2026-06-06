-- Make product-files bucket public so file downloads work
update storage.buckets
set public = true
where id = 'product-files';
