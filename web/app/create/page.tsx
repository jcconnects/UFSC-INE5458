import { CreateEscrowForm } from "@/components/CreateEscrowForm";

export default function CreatePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create escrow</h1>
        <p className="opacity-70 mt-2">
          The client deposits the full amount up front; funds are released only on milestone approval.
        </p>
      </div>
      <CreateEscrowForm />
    </div>
  );
}
