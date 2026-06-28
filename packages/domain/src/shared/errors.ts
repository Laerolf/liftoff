/**
 * Represents an {@link Error} occuring due to a Domain element.
 */
export class DomainError extends Error {
  /**
   * Creates a new {@link DomainError}
   * @param message - The message of the {@link DomainError} to create.
   * @param options - The options of the {@link DomainError} to create.
   */
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
