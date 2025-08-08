export function DecorativeLines() {
  return (
    <>
      {/* Left decorative line */}
      <div className="absolute left-8 top-0 bottom-0 w-px">
        <div className="h-full w-full border-l-2 border-dotted border-gray-300" />
      </div>

      {/* Right decorative line */}
      <div className="absolute right-8 top-0 bottom-0 w-px">
        <div className="h-full w-full border-l-2 border-dotted border-gray-300" />
      </div>
    </>
  );
}
