# Orchard Database Entity Relationship (ER) Diagram

This document details the PostgreSQL database relational schema managed via Prisma ORM.

```mermaid
erDiagram
    USER ||--o{ ADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o1 CART : owns
    USER ||--o1 WISHLIST : owns
    USER ||--o{ REVIEW : writes
    USER ||--o{ AUDIT_LOG : generates

    CATEGORY ||--o{ SUBCATEGORY : contains
    CATEGORY ||--o{ PRODUCT : categorizes

    PRODUCT ||--o{ PRODUCT_IMAGE : has
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT ||--o{ ORDER_ITEM : ordered_in
    PRODUCT ||--o{ REVIEW : rated_by

    ORDER ||--o{ ORDER_ITEM : contains
    ORDER ||--o{ PAYMENT : has
    ORDER ||--o{ REFUND : has
    ORDER }|--|| ADDRESS : ships_to

    CART ||--o{ CART_ITEM : contains
    WISHLIST ||--o{ WISHLIST_ITEM : contains
```

---

## Model Summaries

- **User**: Core authentication identity model supporting role-based access (`CUSTOMER`, `ADMIN`, `SUPER_ADMIN`).
- **Product**: Master inventory table storing base prices, sale prices, variety, chilling hours, harvest season, and stock quantities.
- **ProductVariant**: Specific package configurations (e.g., "5kg Gift Box", "10-Pack M9 Rootstock").
- **Order**: Master transaction table recording payment status, shipping fees, applied coupon discounts, courier tracking details, and fulfillment state.
- **OrderItem**: Snapshotted product and variant pricing at time of purchase.
- **AuditLog**: Security log capturing administrative data mutations.
