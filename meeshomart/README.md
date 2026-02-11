# MeeshoMart WordPress Theme

MeeshoMart is a production-ready, mobile-first WooCommerce marketplace theme optimized for speed, accessibility, and compatibility with multi-vendor plugins.

## Installation
1. Copy the `meeshomart` folder to `wp-content/themes/`.
2. Activate **MeeshoMart** in **Appearance → Themes**.
3. Install and activate WooCommerce.
4. (Optional) Install Dokan, WCFM, or WC Vendors for marketplace styling compatibility.
5. Assign menus in **Appearance → Menus**.
6. Set homepage template to **Homepage** for a marketplace front page.

## What to Customize
- **Customizer**
  - Primary and accent color.
  - Header search visibility.
  - Homepage section toggles.
  - Footer copyright text.
- **Widgets**
  - Sidebar: product filters.
  - Footer 1/2: footer content blocks.
- **Menus**
  - Primary and Footer menus.

## Child Theme Ready Notes
- Keep core customizations in a child theme.
- Override templates by copying files into child theme while preserving paths.
- Use hooks from `inc/woocommerce.php` to adjust product-card output.

## Troubleshooting
- **Cart count not updating:** Ensure WooCommerce is active and theme JS is not blocked by caching plugins.
- **Search suggestions not loading:** Confirm `admin-ajax.php` is reachable and no security plugin is blocking AJAX nonce requests.
- **Vendor pages look unstyled:** Verify one of Dokan/WCFM/WC Vendors is active and clear any page cache.
- **No products on homepage:** Add products and set featured/bestseller status in WooCommerce.

## Performance Notes
- Uses lightweight vanilla JS, deferred scripts, and optimized AJAX product queries.
- Product search responses are cached in transients for 5 minutes.
