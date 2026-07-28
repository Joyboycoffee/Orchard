# Orchard Administrator Operations Manual

This guide provides instructions for store managers and administrators using the Orchard Admin Panel.

---

## 1. Accessing the Admin Panel

Navigate to `/admin` in your browser. Ensure you are signed in with an account possessing `ADMIN` or `SUPER_ADMIN` credentials.

**Default Seed Credentials:**
- **Email:** `admin@orchard.com`
- **Password:** `AdminPassword123!`

---

## 2. Order Fulfillment Workflow

1. Open **Orders & Fulfillment** (`/admin/orders`).
2. Review pending customer orders.
3. Once saplings or produce are packaged in cold-chain containers, select the order status:
   - `PROCESSING`: Order being assembled.
   - `SHIPPED`: Handed over to courier partner.
   - `OUT_FOR_DELIVERY`: Delivery agent en route to customer location.
   - `DELIVERED`: Package successfully delivered.
4. Input **Courier Partner** (e.g., Delhivery, BlueDart) and **Tracking Number**.
5. Click **Update Status**. An audit log entry is recorded automatically.

---

## 3. Inventory & Low Stock Management

1. The Executive Dashboard (`/admin`) flags any products falling below **10 units**.
2. Products under low stock trigger automated stock alerts in the administrative view.
3. Manage inventory replenishments under **Products & Stock** (`/admin/products`).

---

## 4. Audit Logging & Security Tracking

1. Navigate to **Audit Logs** (`/admin/audit-logs`).
2. View chronological records of order status changes, price updates, and administrative logins.
3. Logs capture timestamps, user identities, and action metadata for complete accountability.
