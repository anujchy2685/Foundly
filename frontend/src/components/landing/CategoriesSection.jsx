import React from "react";
import { Link } from "react-router-dom";
import {
  Smartphone,
  WalletCards,
  KeyRound,
  BriefcaseBusiness,
  FileText,
  MoreHorizontal,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
  },
  {
    name: "Wallets",
    icon: WalletCards,
  },
  {
    name: "Keys",
    icon: KeyRound,
  },
  {
    name: "Bags",
    icon: BriefcaseBusiness,
  },
  {
    name: "Documents",
    icon: FileText,
  },
  {
    name: "Other",
    icon: MoreHorizontal,
  },
];

export default function CategoriesSection() {
  return (
    <section className="border-y border-[#e2e7e2] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3 px-6 py-7">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.name}
              to={`/lostitems?category=${encodeURIComponent(category.name)}`}
              className="flex items-center gap-2 rounded-full border border-[#dfe5df] bg-[#fafcf9] px-5 py-2.5 text-sm font-medium text-[#526157] transition hover:border-[#8eb49a] hover:bg-[#eff6f0] hover:text-[#285d41]"
            >
              <Icon size={16} />

              <span>{category.name}</span>
            </Link>
          );
        })}

      </div>
    </section>
  );
}