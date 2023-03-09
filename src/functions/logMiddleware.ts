function logMiddleware(middleware: string): void {
  if (process.env.NODE_ENV != 'development') return;
  console.log(String.fromCodePoint(0x2714) + '  ' + middleware);
  return;
}

export default logMiddleware;
