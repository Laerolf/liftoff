/**
 * Represents a domain element.
 */
export interface DomainElement {
  /**
   * The moment this {@link DomainElement} was created.
   */
  readonly createdAt: Date
  /**
   * The moment this {@link DomainElement} was last updated.
   */
  readonly lastUpdatedAt: Date | null
}
