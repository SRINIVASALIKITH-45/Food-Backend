-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: food_delivery_admin
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('Admin','Manager','Kitchen') DEFAULT 'Admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin','$2b$10$fdyKPUXJ88hVUeaaeBInWOqY.m8quwTp4nKzjFrmT4iqSLR2dGVdS','2026-04-10 09:26:05','Admin');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `admin_id` int DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `details` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_logs`
--

LOCK TABLES `admin_logs` WRITE;
/*!40000 ALTER TABLE `admin_logs` DISABLE KEYS */;
INSERT INTO `admin_logs` VALUES (1,1,'Create Product','{\"name\":\"Chicken\",\"id\":1}','2026-04-10 11:31:14'),(2,1,'Delete Product','{\"id\":\"1\"}','2026-04-10 11:31:42'),(3,1,'Create Product','{\"name\":\"Chicken\",\"id\":2}','2026-04-10 11:34:36'),(4,1,'Update Order Status','{\"id\":\"3\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 11:14:33'),(5,1,'Update Order Status','{\"id\":\"2\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 11:14:36'),(6,1,'Update Order Status','{\"id\":\"1\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 11:14:47'),(7,1,'Create Product','{\"name\":\"Panner butter masala\",\"id\":3}','2026-04-11 11:16:16'),(8,1,'Update Order Status','{\"id\":\"11\",\"status\":\"Pending\",\"reason\":\"\"}','2026-04-11 20:30:52'),(9,1,'Update Order Status','{\"id\":\"12\",\"status\":\"Preparing\",\"reason\":\"\"}','2026-04-11 20:41:30'),(10,1,'Update Order Status','{\"id\":\"12\",\"status\":\"Preparing\",\"reason\":\"\"}','2026-04-11 20:41:35'),(11,1,'Update Order Status','{\"id\":\"12\",\"status\":\"Preparing\",\"reason\":\"\"}','2026-04-11 20:44:18'),(12,1,'Update Order Status','{\"id\":\"11\",\"status\":\"Pending\",\"reason\":\"\"}','2026-04-11 20:44:21'),(13,1,'Update Order Status','{\"id\":\"12\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:44:31'),(14,1,'Update Order Status','{\"id\":\"11\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:44:33'),(15,1,'Update Order Status','{\"id\":\"10\",\"status\":\"Preparing\",\"reason\":\"\"}','2026-04-11 20:44:36'),(16,1,'Update Order Status','{\"id\":\"9\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:44:58'),(17,1,'Update Order Status','{\"id\":\"8\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:00'),(18,1,'Update Order Status','{\"id\":\"7\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:02'),(19,1,'Update Order Status','{\"id\":\"6\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:05'),(20,1,'Update Order Status','{\"id\":\"10\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:13'),(21,1,'Update Order Status','{\"id\":\"5\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:16'),(22,1,'Update Order Status','{\"id\":\"4\",\"status\":\"Delivered\",\"reason\":\"\"}','2026-04-11 20:45:18'),(23,1,'Update Order Status','{\"id\":\"13\",\"status\":\"Order Accepted\"}','2026-04-11 21:02:33'),(24,1,'Update Order Status','{\"id\":\"14\",\"status\":\"Order Accepted\"}','2026-04-11 21:17:24'),(25,1,'Update Order Status','{\"id\":\"15\",\"status\":\"Order Accepted\"}','2026-04-12 03:15:09'),(26,1,'Update Order Status','{\"id\":\"16\",\"status\":\"Order Accepted\"}','2026-04-12 07:56:01'),(27,1,'Update Order Status','{\"id\":\"17\",\"status\":\"Delivered\"}','2026-04-12 08:29:18'),(28,1,'Update Order Status','{\"id\":\"19\",\"status\":\"Delivered\"}','2026-04-12 08:31:13'),(29,1,'Update Order Status','{\"id\":\"18\",\"status\":\"Delivered\"}','2026-04-12 08:31:14');
/*!40000 ALTER TABLE `admin_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `emoji` varchar(10) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'NON-VEG','','2026-04-10 11:21:54','N','#4F46E5'),(2,'Biryani',NULL,'2026-04-10 14:43:37','B','#4F46E5'),(3,'Pizza',NULL,'2026-04-10 14:43:37','P','#4F46E5'),(4,'Tiffins',NULL,'2026-04-10 14:43:37','T','#4F46E5'),(5,'Meals',NULL,'2026-04-10 14:43:37','M','#4F46E5'),(6,'Beverages',NULL,'2026-04-10 14:43:37','Be','#4F46E5'),(7,'Snacks',NULL,'2026-04-10 14:43:37','S','#4F46E5'),(8,'Desserts',NULL,'2026-04-10 14:43:37','D','#4F46E5'),(9,'Burgers',NULL,'2026-04-10 14:43:37','Bu','#4F46E5');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_usage`
--

DROP TABLE IF EXISTS `coupon_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_usage` (
  `id` int NOT NULL AUTO_INCREMENT,
  `coupon_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `used_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `coupon_usage_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `coupon_usage_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_usage`
--

LOCK TABLES `coupon_usage` WRITE;
/*!40000 ALTER TABLE `coupon_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `expiry_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `max_usage_per_user` int DEFAULT '1',
  `min_order_value` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (1,'WELCOME50',50.00,1,'2026-12-31','2026-04-10 14:43:37',1,0.00),(2,'FREESHIP',15.00,1,'2026-12-31','2026-04-10 14:43:37',1,0.00),(3,'WEEKEND75',75.00,1,'2026-12-31','2026-04-10 14:43:37',1,0.00);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_favorites`
--

DROP TABLE IF EXISTS `customer_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `customer_favorites_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `customer_favorites_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_favorites`
--

LOCK TABLES `customer_favorites` WRITE;
/*!40000 ALTER TABLE `customer_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_blocked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `location` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Mangapuram Srinivasalikith','likithmangapuram@gmail.com','9014472021',0,'2026-04-10 09:58:54','$2b$10$EiaD/4Rrg7ISWMj4Hzrlu.fggSo2b6L.RWaNRxRtCgiIdkz.pXNwO','Male','Thummalgunta'),(2,'Browser Test','browser@test.com','1234567890',0,'2026-04-11 11:27:40','$2b$10$my/DQJyy4ep5zBYIa9Fiz.tz57X04JVL6V18k5BR9d4wd7CZhMh2K','Male','Test Address'),(3,'Likith','srinivasalikithmangapuram@gmail.com','9014472021',0,'2026-04-11 21:30:56','$2b$10$w/vNjHhuwQJ3fv38IDjoMu..GGlQVx1dWxK6lkqxv.dkHZIKvSgPK','Male','Thummalgunta');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_zones`
--

DROP TABLE IF EXISTS `delivery_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_zones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zone_name` varchar(100) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zone_name` (`zone_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_zones`
--

LOCK TABLES `delivery_zones` WRITE;
/*!40000 ALTER TABLE `delivery_zones` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '$2b$10$sajAF91nG/v0pubmRydHEOH7kGrgdKuJucKRKFhYiRJqw3.IBiIwK',
  `vehicle_details` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'srinu','9014472021','$2b$10$HBPL9TOTlhhg0sFuN5r2GONo3C3luBwGUrxTTsCGqmtbW6S8QYL42','',1,'2026-04-11 20:15:15');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kitchen_staff`
--

DROP TABLE IF EXISTS `kitchen_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kitchen_staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kitchen_staff`
--

LOCK TABLES `kitchen_staff` WRITE;
/*!40000 ALTER TABLE `kitchen_staff` DISABLE KEYS */;
INSERT INTO `kitchen_staff` VALUES (1,'Main Chef','8888888888','$2b$10$vncKhxSL/ggOYMLnIFMZauELY9o8BaueFPcMkvMe4WUVMnBRC6I9y',1,'2026-04-12 06:59:01','2026-04-12 05:37:22'),(2,'Raju','9014472021','$2b$10$oKhAAeqmT9nng28d/fUV7.SnBpBtCu1UAzO.jDufW/6.Fw0LJb7hy',1,'2026-04-12 08:30:09','2026-04-12 05:37:39');
/*!40000 ALTER TABLE `kitchen_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kots`
--

DROP TABLE IF EXISTS `kots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `writer_id` int DEFAULT NULL,
  `items_json` json NOT NULL,
  `status` enum('Pending','Preparing','Ready','Served') DEFAULT 'Pending',
  `priority` enum('Normal','Urgent','VIP') DEFAULT 'Normal',
  `is_printed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_name` varchar(100) DEFAULT NULL,
  `pax` int DEFAULT NULL,
  `version` int DEFAULT '1',
  `new_items_json` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `table_id` (`table_id`),
  KEY `writer_id` (`writer_id`),
  CONSTRAINT `kots_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `kots_ibfk_2` FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`) ON DELETE SET NULL,
  CONSTRAINT `kots_ibfk_3` FOREIGN KEY (`writer_id`) REFERENCES `writers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kots`
--

LOCK TABLES `kots` WRITE;
/*!40000 ALTER TABLE `kots` DISABLE KEYS */;
INSERT INTO `kots` VALUES (1,17,1,1,'[{\"name\": \"Chicken\", \"note\": \"\", \"price\": \"500.00\", \"quantity\": 3, \"product_id\": 2}, {\"name\": \"Panner butter masala\", \"note\": \"\", \"price\": \"450.00\", \"quantity\": 2, \"product_id\": 3}]','Served','Normal',0,'2026-04-12 03:56:46',NULL,NULL,5,'[{\"name\": \"Chicken\", \"price\": \"500.00\", \"quantity\": 1, \"added_qty\": 1, \"product_id\": 2}]'),(2,18,2,1,'[{\"name\": \"Panner butter masala\", \"price\": \"450.00\", \"quantity\": 2, \"product_id\": 3}]','Served','Normal',0,'2026-04-12 04:28:28','vinay',2,1,NULL),(3,18,2,1,'[{\"name\": \"Panner butter masala\", \"price\": \"450.00\", \"quantity\": 1, \"product_id\": 3}]','Served','Normal',0,'2026-04-12 04:31:13','vinay',2,1,NULL),(4,17,1,1,'[{\"name\": \"Panner butter masala\", \"price\": \"450.00\", \"quantity\": 1, \"product_id\": 3}]','Served','Normal',0,'2026-04-12 04:52:28',NULL,NULL,2,NULL),(5,17,1,1,'[{\"name\": \"Panner butter masala\", \"price\": \"450.00\", \"quantity\": 1, \"product_id\": 3}]','Served','Normal',0,'2026-04-12 07:04:15',NULL,NULL,1,NULL),(6,19,3,1,'[{\"name\": \"Panner butter masala\", \"price\": \"450.00\", \"quantity\": 1, \"product_id\": 3}, {\"name\": \"Chicken\", \"price\": \"500.00\", \"quantity\": 1, \"product_id\": 2}]','Served','Normal',0,'2026-04-12 07:17:39','Test Guest',22,1,NULL);
/*!40000 ALTER TABLE `kots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,2,4,500.00),(2,2,2,1,500.00),(3,3,2,1,500.00),(4,4,3,4,450.00),(5,5,2,1,500.00),(6,5,3,1,450.00),(7,6,3,1,450.00),(8,7,3,1,450.00),(9,8,3,1,450.00),(10,9,2,1,500.00),(11,10,2,1,500.00),(12,11,2,1,500.00),(13,11,3,1,450.00),(14,12,3,3,450.00),(15,13,3,1,450.00),(16,14,2,10,500.00),(17,15,2,2,500.00),(18,15,3,1,450.00),(19,16,2,1,500.00),(20,17,2,3,500.00),(21,17,3,4,450.00),(22,18,3,3,450.00),(23,19,2,1,500.00),(24,19,3,1,450.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id_string` varchar(50) DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `driver_id` int DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `is_dine_in` tinyint(1) DEFAULT '0',
  `order_type` enum('Delivery','Dine-in') DEFAULT 'Delivery',
  `status` varchar(50) DEFAULT 'Pending',
  `delivery_address` text NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `gst_amount` decimal(10,2) DEFAULT '0.00',
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `packaging_charge` decimal(10,2) DEFAULT '0.00',
  `payment_method` varchar(20) DEFAULT 'COD',
  `cancellation_reason` text,
  `estimated_delivery_time` timestamp NULL DEFAULT NULL,
  `delivery_otp` varchar(6) DEFAULT NULL,
  `otp_expiry` timestamp NULL DEFAULT NULL,
  `is_arrived` tinyint(1) DEFAULT '0',
  `commission_amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id_string` (`order_id_string`),
  KEY `customer_id` (`customer_id`),
  KEY `driver_id` (`driver_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,1,NULL,NULL,2100.00,0,'Delivery','Delivered','Default Address',NULL,NULL,'2026-04-10 14:48:54',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(2,NULL,1,NULL,NULL,525.00,0,'Delivery','Delivered','Default Address',NULL,NULL,'2026-04-10 14:49:16',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(3,NULL,1,NULL,NULL,525.00,0,'Delivery','Delivered','Default Address',NULL,NULL,'2026-04-10 14:58:24',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(4,NULL,1,NULL,NULL,1890.00,0,'Delivery','Delivered','Default Address',NULL,NULL,'2026-04-11 11:31:17',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(5,NULL,1,NULL,NULL,998.00,0,'Delivery','Delivered','Default Address',NULL,NULL,'2026-04-11 16:38:51',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(6,'ORD-20260411-OYS2',1,NULL,NULL,473.00,0,'Delivery','Delivered','Standard Delivery Address','Mangapuram Srinivasalikith','9014472021','2026-04-11 16:43:48',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(7,'ORD-20260411-2BJU',1,NULL,NULL,473.00,0,'Delivery','Delivered','Standard Delivery Address','Mangapuram Srinivasalikith','9014472021','2026-04-11 16:46:35',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(8,'ORD-20260411-0OZ8',1,NULL,NULL,473.00,0,'Delivery','Delivered','Standard Delivery Address','Mangapuram Srinivasalikith','9014472021','2026-04-11 16:47:27',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(9,'ORD-20260411-O070',1,NULL,NULL,525.00,0,'Delivery','Delivered','Standard Delivery Address','Mangapuram Srinivasalikith','9014472021','2026-04-11 17:33:26',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(10,'ORD-20260411-UX23',1,NULL,NULL,525.00,0,'Delivery','Delivered','Standard Delivery Address','Mangapuram Srinivasalikith','9014472021','2026-04-11 17:40:07',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'990436','2026-04-11 20:54:37',0,0.00),(11,'ORD-20260411-0S9T',1,NULL,NULL,998.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-11 19:36:43',NULL,0.00,0.00,0.00,'COD',NULL,NULL,NULL,NULL,0,0.00),(12,'ORD-20260411-ZRJK',1,NULL,NULL,1418.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-11 20:41:07',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'935965','2026-04-11 20:54:18',0,0.00),(13,'ORD-20260411-H1AD',1,1,NULL,473.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-11 20:57:25',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'466185','2026-04-11 21:12:34',1,0.00),(14,'ORD-20260411-GGH2',1,1,NULL,5250.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-11 21:16:52',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'845292','2026-04-11 21:27:24',1,30.00),(15,'ORD-20260412-U0BK',1,1,NULL,1523.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-12 03:14:30',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'205042','2026-04-12 03:25:10',1,30.00),(16,'ORD-20260412-VKP3',1,1,NULL,525.00,0,'Delivery','Delivered','Thummalagunta','Mangapuram Srinivasalikith','9014472021','2026-04-12 07:55:27',NULL,0.00,0.00,0.00,'COD',NULL,NULL,'849465','2026-04-12 08:06:02',1,30.00),(17,'ORD-DIN-20260412-JYXW',NULL,NULL,1,3465.00,1,'Dine-in','Delivered','Dine-in','Guest',NULL,'2026-04-12 08:19:53',NULL,165.00,0.00,0.00,'Table Payment',NULL,NULL,NULL,NULL,0,0.00),(18,'ORD-DIN-20260412-N6XX',NULL,NULL,2,1417.50,1,'Dine-in','Delivered','Dine-in','vinay',NULL,'2026-04-12 08:30:53',NULL,67.50,0.00,0.00,'Table Payment',NULL,NULL,NULL,NULL,0,0.00),(19,'ORD-DIN-20260412-LV6D',NULL,NULL,3,997.50,1,'Dine-in','Delivered','Dine-in','Test Guest',NULL,'2026-04-12 08:30:58',NULL,47.50,0.00,0.00,'Table Payment',NULL,NULL,NULL,NULL,0,0.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `detail` varchar(100) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,1,'Credit Card','****1234',0,'2026-04-11 18:38:24'),(2,1,'Debit Card','12344',0,'2026-04-11 18:42:34');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `product_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`product_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `product_tags_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
INSERT INTO `product_tags` VALUES (2,6),(2,7),(2,9);
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category_id` int DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `prep_time` int DEFAULT '15',
  `rating` decimal(3,2) DEFAULT '4.00',
  `review_count` int DEFAULT '0',
  `is_customisable` tinyint(1) DEFAULT '0',
  `delivery_time` int DEFAULT '30',
  `has_offer` tinyint(1) DEFAULT '0',
  `free_delivery` tinyint(1) DEFAULT '0',
  `is_seasonal` tinyint(1) DEFAULT '0',
  `food_type` enum('Veg','Non-Veg','Egg') DEFAULT 'Veg',
  `spice_level` enum('Mild','Medium','Spicy') DEFAULT 'Mild',
  `meal_type` enum('Breakfast','Lunch','Dinner','Snacks') DEFAULT 'Lunch',
  `portion` enum('Half','Full','Family Pack') DEFAULT 'Full',
  `dietary_preference` enum('None','Vegan','Gluten-Free','Dairy-Free') DEFAULT 'None',
  `price_range` enum('Budget','Medium','Premium') DEFAULT 'Medium',
  `temperature` enum('Hot','Cold') DEFAULT 'Hot',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,'Chicken',1,500.00,20,'','/uploads/1775820876194.png',1,'2026-04-10 11:34:36',15,4.70,80,0,25,1,1,0,'Non-Veg','Medium','Dinner','Family Pack','None','Medium','Hot'),(3,'Panner butter masala',5,450.00,20,'','/uploads/1775906176658.png',1,'2026-04-11 11:16:16',15,3.80,215,1,50,0,0,0,'Veg','Mild','Lunch','Full','Vegan','Medium','Hot');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_tables`
--

DROP TABLE IF EXISTS `restaurant_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_number` varchar(20) NOT NULL,
  `capacity` int DEFAULT '4',
  `status` enum('Available','Occupied','Cleaning','Reserved') DEFAULT 'Available',
  `current_order_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `pax` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_tables`
--

LOCK TABLES `restaurant_tables` WRITE;
/*!40000 ALTER TABLE `restaurant_tables` DISABLE KEYS */;
INSERT INTO `restaurant_tables` VALUES (1,'T-1',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(2,'T-2',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(3,'T-3',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(4,'T-4',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(5,'T-5',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(6,'T-6',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(7,'T-7',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(8,'T-8',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(9,'T-9',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(10,'T-10',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(11,'T-11',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL),(12,'T-12',4,'Available',NULL,'2026-04-12 03:32:12',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `restaurant_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_addresses`
--

DROP TABLE IF EXISTS `saved_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `label` varchar(50) DEFAULT 'Home',
  `address` text NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `saved_addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_addresses`
--

LOCK TABLES `saved_addresses` WRITE;
/*!40000 ALTER TABLE `saved_addresses` DISABLE KEYS */;
INSERT INTO `saved_addresses` VALUES (1,1,'Work','123 Main St',0,'2026-04-11 18:37:59'),(2,1,'Work','123 Main St',0,'2026-04-11 18:38:24'),(3,1,'HOME','Thummalagunta',0,'2026-04-11 18:42:21');
/*!40000 ALTER TABLE `saved_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'is_restaurant_open','true','2026-04-10 10:25:53'),(2,'gst_percentage','5','2026-04-10 10:25:53'),(3,'delivery_charge','40','2026-04-10 10:25:53'),(4,'packaging_charge','10','2026-04-10 10:25:53'),(5,'festival_mode_active','false','2026-04-10 10:25:53'),(41,'restaurant_name','Tirupati Hubspot','2026-04-11 19:20:44'),(42,'restaurant_rating','4.8','2026-04-11 19:20:44'),(43,'restaurant_reviews','2k+','2026-04-11 19:20:44'),(44,'restaurant_cuisine','North Indian, Chinese, Continental','2026-04-11 19:20:44'),(45,'restaurant_time','25-30 min','2026-04-11 19:20:44');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (6,'Best Seller'),(7,'Chef Special'),(4,'Crispy'),(9,'Festival Special'),(10,'Prasadam'),(5,'Soft'),(2,'Spicy'),(1,'Sweet'),(3,'Tangy'),(11,'Temple Special'),(8,'Top Rated');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `writers`
--

DROP TABLE IF EXISTS `writers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `writers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_on_duty` tinyint(1) DEFAULT '0',
  `last_login_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `writers`
--

LOCK TABLES `writers` WRITE;
/*!40000 ALTER TABLE `writers` DISABLE KEYS */;
INSERT INTO `writers` VALUES (1,'Test Writer','9999999999','$2b$10$w9dKXSzJUV2.OpgCtaE4guqcUWjqE02N38cuurzCwgVkqK.750TX2',1,'2026-04-12 07:00:57','2026-04-12 03:32:12');
/*!40000 ALTER TABLE `writers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-13 13:22:02
