import { StoreSettingsClient } from "../../admin-client";
import { AdminShell } from "../../components";
import { cars } from "../../data";

export default function StoreSettingsPage() {
  return (
    <AdminShell mode="shop">
      <StoreSettingsClient seedCars={cars} />
    </AdminShell>
  );
}
