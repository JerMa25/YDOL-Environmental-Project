export default function Footer() {
  return (
    <footer className="border-t text-center py-4 text-gray-500 text-sm">
      © {new Date().getFullYear()} Waste Tracker
    </footer>
  );
}