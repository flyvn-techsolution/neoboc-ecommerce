-- Drop product-level stock and switch variants to name + sku + stock + image

ALTER TABLE "product_variants"
ADD COLUMN "name" TEXT;

UPDATE "product_variants"
SET "name" = COALESCE(NULLIF("option_value", ''), NULLIF("variant_name", ''), 'Variant');

ALTER TABLE "product_variants"
ALTER COLUMN "name" SET NOT NULL;

ALTER TABLE "product_variants"
ADD COLUMN "image" TEXT;

ALTER TABLE "product_variants"
DROP COLUMN "variant_name",
DROP COLUMN "option_value";

ALTER TABLE "products"
DROP COLUMN "stock";
