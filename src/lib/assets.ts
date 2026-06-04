const productionBasePath = '/mythstride-site';

export function getAssetPath(path: string) {
  if (!path || path.startsWith('http') || path.startsWith('data:')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NODE_ENV === 'production' ? productionBasePath : '';

  if (basePath && normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
}
