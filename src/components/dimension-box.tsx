export default function DimensionBox() {
  return (
    <div className="w-60 h-60 relative inner-border inner-border-border">
      <span className="w-2.5 absolute top-0 -left-2.5 border-t" />
      <span className="w-2.5 absolute bottom-0 -left-2.5 border-t" />
      <span className="w-2.5 absolute top-0 -right-2.5 border-t" />
      <span className="w-2.5 absolute bottom-0 -right-2.5 border-t" />
      <div className="h-2.5 absolute -top-2.5 left-2/4 border-r"></div>
      <div className="h-2.5 absolute -bottom-2.5 left-2/4 border-r"></div>
      <div className="w-2.5 absolute -left-2.5 top-2/4 border-t"></div>
      <div className="w-2.5 absolute -right-2.5 top-2/4 border-t"></div>
    </div>
  );
}
