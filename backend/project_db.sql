-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2026 at 05:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`, `created_at`) VALUES
(1, 'dog', '2026-03-10 13:26:55'),
(2, 'cat', '2026-03-10 13:27:06'),
(3, 'fish', '2026-03-10 13:27:22'),
(4, 'bird', '2026-03-10 13:27:35');

-- --------------------------------------------------------

--
-- Table structure for table `fulfillments`
--

CREATE TABLE `fulfillments` (
  `fulfillment_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `shipping_carrier` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(200) DEFAULT NULL,
  `tracking_url` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `shipped_at` timestamp NULL DEFAULT NULL,
  `estimated_delivery` date DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `shipping_name` varchar(150) NOT NULL,
  `shipping_phone` varchar(20) NOT NULL,
  `shipping_address` varchar(500) NOT NULL,
  `shipping_city` varchar(150) NOT NULL,
  `shipping_state` varchar(150) NOT NULL DEFAULT 'Bagmati Province',
  `shipping_country` varchar(100) NOT NULL DEFAULT 'Nepal',
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `grand_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(20) NOT NULL DEFAULT 'cod',
  `payment_status` varchar(20) NOT NULL DEFAULT 'pending',
  `order_status` varchar(20) NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `placed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_weight` varchar(50) DEFAULT NULL,
  `sku` varchar(150) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `line_total` decimal(12,2) NOT NULL,
  `commission_rate` decimal(5,2) NOT NULL DEFAULT 5.00,
  `commission_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `seller_payout_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `fulfillment_status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status_logs`
--

CREATE TABLE `order_status_logs` (
  `log_id` bigint(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `old_status` varchar(20) DEFAULT NULL,
  `new_status` varchar(20) NOT NULL,
  `note` text DEFAULT NULL,
  `changed_by` int(11) NOT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `sku` varchar(150) DEFAULT NULL,
  `weight` varchar(50) DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(500) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `rejected_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `seller_id`, `category_id`, `type_id`, `name`, `sku`, `weight`, `description`, `price`, `stock`, `image`, `status`, `rejected_reason`, `created_at`, `updated_at`) VALUES
(4, 1, 1, 1, 'Royal Canin Adult Dog Food', 'SKU-DOG-LK3F2A-X7Q1', '2.50', 'Premium dry food for adult dogs with balanced nutrition for coat and digestion.', 899.00, 50, '/mvp/public/assets/images/dog-products/dummy_dog_food.jpg', 'approved', NULL, '2026-03-01 03:15:00', '2026-03-13 15:56:58'),
(5, 1, 1, 2, 'Rubber Chew Toy Set', 'SKU-DOG-LK3F2B-X7Q2', '0.30', 'Durable rubber chew toys in 3 sizes to keep dogs entertained and teeth clean.', 349.00, 80, '/mvp/public/assets/images/dog-products/dummy_dog_toy.jpg', 'approved', NULL, '2026-03-02 04:30:00', '2026-03-13 15:56:58'),
(6, 1, 1, 3, 'Dog Deshedding Brush', 'SKU-DOG-LK3F2C-X7Q3', '0.20', 'Ergonomic deshedding brush that reduces loose fur by up to 90% for all coat types.', 550.00, 40, '/mvp/public/assets/images/dog-products/dummy_dog_brush.jpg', 'pending', NULL, '2026-03-10 02:45:00', '2026-03-13 15:56:58'),
(7, 1, 2, 1, 'Whiskas Kitten Wet Food 12-Pack', 'SKU-CAT-LK3F2D-X7Q4', '1.80', 'Nutritious wet food pouches specially formulated for kittens under 12 months.', 420.00, 100, '/mvp/public/assets/images/cat-products/dummy_cat_food.jpg', 'approved', NULL, '2026-03-03 05:15:00', '2026-03-13 15:56:58'),
(8, 1, 2, 4, 'Adjustable Cat Collar with Bell', 'SKU-CAT-LK3F2E-X7Q5', '0.05', 'Soft nylon breakaway collar with a safety bell. Fits necks 20–30cm.', 150.00, 120, '/mvp/public/assets/images/cat-products/dummy_cat_collar.jpg', 'approved', NULL, '2026-03-04 08:35:00', '2026-03-13 15:56:58'),
(9, 1, 2, 5, 'Cat Deworming Tablets 10-Pack', 'SKU-CAT-LK3F2F-X7Q6', '0.10', 'Broad-spectrum deworming tablets for cats. Effective against roundworms and tapeworms.', 280.00, 60, '/mvp/public/assets/images/cat-products/dummy_cat_dewormer.jpg', 'rejected', 'Missing veterinary approval label on image.', '2026-03-05 04:00:00', '2026-03-13 15:56:58'),
(10, 1, 3, 1, 'Tropical Fish Flake Food 200g', 'SKU-FSH-LK3F2G-X7Q7', '0.20', 'High-protein flake food for tropical freshwater fish. Enhances colour and vitality.', 199.00, 75, '/mvp/public/assets/images/fish-products/dummy_fish_food.jpg', 'approved', NULL, '2026-03-06 07:15:00', '2026-03-13 15:56:58'),
(11, 1, 3, 4, 'Aquarium LED Light Strip 60cm', 'SKU-FSH-LK3F2H-X7Q8', '0.40', 'Waterproof LED strip light for 60cm tanks. Supports plant growth and fish colouration.', 750.00, 30, '/mvp/public/assets/images/fish-products/dummy_fish_light.jpg', 'pending', NULL, '2026-03-11 02:05:00', '2026-03-13 15:56:58'),
(12, 1, 4, 1, 'Versele-Laga Budgie Seed Mix 1kg', 'SKU-BRD-LK3F2I-X7Q9', '1.00', 'Premium seed blend for budgerigars with added vitamins and minerals.', 320.00, 90, '/mvp/public/assets/images/bird-products/dummy_bird_food.jpg', 'approved', NULL, '2026-03-07 04:45:00', '2026-03-13 15:56:58'),
(13, 1, 4, 2, 'Bird Swing and Perch Toy Set', 'SKU-BRD-LK3F2J-X7Q0', '0.15', 'Colourful wooden swing and perch set for parrots and budgies. Promotes activity.', 275.00, 55, '/mvp/public/assets/images/bird-products/dummy_bird_toy.jpg', 'pending', NULL, '2026-03-12 10:15:00', '2026-03-13 15:56:58');

-- --------------------------------------------------------

--
-- Table structure for table `product_types`
--

CREATE TABLE `product_types` (
  `type_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_types`
--

INSERT INTO `product_types` (`type_id`, `type_name`, `created_at`) VALUES
(1, 'Food', '2026-03-13 20:56:17'),
(2, 'Toys', '2026-03-13 20:56:17'),
(3, 'Grooming', '2026-03-13 20:56:17'),
(4, 'Accessories', '2026-03-13 20:56:17'),
(5, 'Healthcare', '2026-03-13 20:56:17');

-- --------------------------------------------------------

--
-- Table structure for table `sellers`
--

CREATE TABLE `sellers` (
  `seller_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `business_phone` varchar(20) NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sellers`
--

INSERT INTO `sellers` (`seller_id`, `user_id`, `business_phone`, `status`, `created_at`) VALUES
(1, 2, '9817206878', 'active', '2026-03-10 13:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `seller_payouts`
--

CREATE TABLE `seller_payouts` (
  `payout_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `gross_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `commission_deducted` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payout_method` varchar(20) NOT NULL DEFAULT 'bank_transfer',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `reference_number` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop`
--

CREATE TABLE `shop` (
  `shop_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `store_name` varchar(255) NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `city` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop`
--

INSERT INTO `shop` (`shop_id`, `seller_id`, `store_name`, `address`, `city`, `created_at`, `updated_at`) VALUES
(1, 1, 'Pet Glory Shop', 'Balaju-8', 'kathmandu', '2026-03-10 13:03:27', '2026-03-10 13:03:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `fname` varchar(40) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'user',
  `status` enum('active','suspended','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `fname`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(1, 'James Karki', 'jameskarki@gmail.com', '$2y$10$t3iYI2tSZR1rRZuIs.fJOuodWxosR3jhU5PpTrpA8lZ9tAb2bxTva', 'user', 'active', '2026-03-10 12:59:34'),
(2, 'Upasana Karki', 'upasanakarki@gmail.com', '$2y$10$SREXlG1g9ujRVilNXhLre.IQ1oahIGcpi5EyB.hjZYxIFus.HjmcO', 'seller', 'active', '2026-03-10 13:03:27'),
(3, 'Shushila Khadka', '123Shushila@gmail.com', '$2y$10$PhXtHDKAR7C2ca.VMa.sY.QJYMQ5.VcisOwI22tBD2/ducTGZdvD2', 'user', 'active', '2026-03-10 15:41:24');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `uq_categories_name` (`category_name`);

--
-- Indexes for table `fulfillments`
--
ALTER TABLE `fulfillments`
  ADD PRIMARY KEY (`fulfillment_id`),
  ADD UNIQUE KEY `idx_fulfillments_order_seller` (`order_id`,`seller_id`),
  ADD KEY `idx_fulfillments_order_id` (`order_id`),
  ADD KEY `idx_fulfillments_seller_id` (`seller_id`),
  ADD KEY `idx_fulfillments_status` (`status`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD UNIQUE KEY `idx_orders_order_number` (`order_number`),
  ADD KEY `idx_orders_customer_id` (`customer_id`),
  ADD KEY `idx_orders_order_status` (`order_status`),
  ADD KEY `idx_orders_placed_at` (`placed_at`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `idx_order_items_order_id` (`order_id`),
  ADD KEY `idx_order_items_seller_id` (`seller_id`),
  ADD KEY `idx_order_items_product_id` (`product_id`),
  ADD KEY `idx_order_items_fulfillment_status` (`seller_id`,`fulfillment_status`);

--
-- Indexes for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_order_logs_changed_by` (`changed_by`),
  ADD KEY `idx_order_status_logs_order_id` (`order_id`),
  ADD KEY `idx_order_status_logs_changed_at` (`changed_at`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_seller_id` (`seller_id`),
  ADD KEY `idx_products_category_id` (`category_id`),
  ADD KEY `idx_products_status` (`status`),
  ADD KEY `idx_products_created_at` (`created_at`),
  ADD KEY `fk_product_type` (`type_id`);

--
-- Indexes for table `product_types`
--
ALTER TABLE `product_types`
  ADD PRIMARY KEY (`type_id`);

--
-- Indexes for table `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`seller_id`),
  ADD KEY `idx_sellers_user_id` (`user_id`);

--
-- Indexes for table `seller_payouts`
--
ALTER TABLE `seller_payouts`
  ADD PRIMARY KEY (`payout_id`),
  ADD KEY `idx_payouts_seller_id` (`seller_id`),
  ADD KEY `idx_payouts_status` (`status`),
  ADD KEY `idx_payouts_created_at` (`created_at`);

--
-- Indexes for table `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`shop_id`),
  ADD UNIQUE KEY `uq_shop_seller_id` (`seller_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `fulfillments`
--
ALTER TABLE `fulfillments`
  MODIFY `fulfillment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  MODIFY `log_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_types`
--
ALTER TABLE `product_types`
  MODIFY `type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sellers`
--
ALTER TABLE `sellers`
  MODIFY `seller_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `seller_payouts`
--
ALTER TABLE `seller_payouts`
  MODIFY `payout_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop`
--
ALTER TABLE `shop`
  MODIFY `shop_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fulfillments`
--
ALTER TABLE `fulfillments`
  ADD CONSTRAINT `fk_fulfillments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_fulfillments_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_items_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_status_logs`
--
ALTER TABLE `order_status_logs`
  ADD CONSTRAINT `fk_order_logs_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order_logs_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_type` FOREIGN KEY (`type_id`) REFERENCES `product_types` (`type_id`),
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_products_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sellers`
--
ALTER TABLE `sellers`
  ADD CONSTRAINT `fk_sellers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `seller_payouts`
--
ALTER TABLE `seller_payouts`
  ADD CONSTRAINT `fk_payouts_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON UPDATE CASCADE;

--
-- Constraints for table `shop`
--
ALTER TABLE `shop`
  ADD CONSTRAINT `fk_shop_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`seller_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
