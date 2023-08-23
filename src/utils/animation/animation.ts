export const sliceCyspAnimation = (buffer: ArrayBuffer) => {
  const view = new DataView(buffer);
  const count = view.getInt32(12, true);
  return {
    count: count,
    data: buffer.slice((count + 1) * 32),
  };
};
