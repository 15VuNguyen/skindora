export default function Splitter() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card text-muted-foreground px-2">Or continue with</span>
      </div>
    </div>
  );
}
