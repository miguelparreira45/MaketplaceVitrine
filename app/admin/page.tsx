import { AdminInventoryClient } from "../admin-client";
import { AdminShell } from "../components";
import { cars } from "../data";

export default function AdminPage() {
  return (
    <AdminShell mode="shop">
      <AdminInventoryClient seedCars={cars} />
    </AdminShell>
  );
}
