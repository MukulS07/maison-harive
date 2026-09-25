import Image from "next/image";
import type { Product } from "@/content/products";
import { Numeral } from "../ui";

/**
 * A round gold-set medallion holding the product photo, or a huge outlined numeral until
 * photos exist (spec §5.2): a 1px gold rim, 6px padding, then a dark bezel at 40% gold.
 */
export function Medallion({
  product,
  numeral,
  size,
  className = "",
}: {
  product: Product;
  numeral: string;
  size: number;
  className?: string;
}) {
  return (
    <span
      className={`block shrink-0 rounded-full border border-gold bg-black p-1.5 transition-shadow duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gold/40"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--km-gold-deep) 45%, var(--km-black)), var(--km-black) 70%)",
        }}
      >
        {product.image ? (
          <Image src={product.image} alt="" fill sizes={`${size}px`} className="object-cover" />
        ) : (
          <span style={{ fontSize: Math.round(size * 0.4) }}>
            <Numeral>{numeral}</Numeral>
          </span>
        )}
      </span>
    </span>
  );
}
