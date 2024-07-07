export const objectToTuple = (obj: object): any[] => {
  return Object.values(obj).map((value) =>
    typeof value == 'object' && value !== null && !Array.isArray(value) ? objectToTuple(value) : value,
  );
};
