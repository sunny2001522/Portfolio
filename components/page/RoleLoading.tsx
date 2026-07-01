export default function RoleLoading() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
        <div className="text-xs font-bold tracking-[0.3em] text-gray-400 uppercase">
          Loading
        </div>
      </div>
    </div>
  );
}
