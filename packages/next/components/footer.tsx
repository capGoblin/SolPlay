import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer role="contentinfo" className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <a
          href="https://devfolio.co/@lokeshwaran100"
          className="hover:underline"
        >
          Developer
        </a>
        <div className="flex items-center space-x-4">
          <a
            href="https://explorer.solana.com/address/Br2jNdq8NZa8BQYbPcNXKHaM7MeXUanZe2WLNpSy8fHN?cluster=devnet"
            className="hover:underline"
          >
            Br2jNd...Sy8fHN
          </a>
          <a
            href="https://github.com/capGoblin/SolPlay"
            className="flex items-center hover:underline"
          >
            <FaGithub className="text-xl mr-2" />
          </a>
        </div>
      </div>
    </footer>
  );
}
