/**
 * Validates that a count argument was passed.
 *
 * @returns {number} The count argument.
 * @throws {Error} If the count argument is not a number.
 */
export const getCount = () => {
  if (!process.env.DROPLET_COUNT) {
    throw new Error("Please set the droplet count in the .env file.");
  }
  const parsed = parseInt(process.env.DROPLET_COUNT, 10);
  if (isNaN(parsed)) {
    throw new Error(
      `Please provide a valid count. Received: ${process.argv[2]}`
    );
  }
  return parsed;
};
