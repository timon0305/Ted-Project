CREATE DATABASE  IF NOT EXISTS `ted-2020` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ted-2020`;
-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: ted-2020
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dates`
--

DROP TABLE IF EXISTS `dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dates` (
  `date_id` int NOT NULL,
  `property_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `reservations` int DEFAULT NULL,
  PRIMARY KEY (`date_id`,`date`),
  UNIQUE KEY `date_UNIQUE` (`date`),
  UNIQUE KEY `date_id_UNIQUE` (`date_id`),
  KEY `availability_dates_idx` (`property_id`,`date_id`),
  KEY `reservation_idx` (`reservations`),
  CONSTRAINT `availability_dates` FOREIGN KEY (`property_id`, `date_id`) REFERENCES `properties` (`property_id`, `availability_dates`),
  CONSTRAINT `reservation_id` FOREIGN KEY (`reservations`) REFERENCES `reservations` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dates`
--

LOCK TABLES `dates` WRITE;
/*!40000 ALTER TABLE `dates` DISABLE KEYS */;
INSERT INTO `dates` VALUES (1,NULL,'2020-07-01',NULL),(2,NULL,'2020-07-02',NULL),(3,NULL,'2020-07-03',NULL),(4,NULL,'2020-07-04',NULL),(5,NULL,'2020-07-05',NULL),(6,NULL,'2020-07-06',NULL),(7,NULL,'2020-07-07',NULL),(8,NULL,'2020-07-08',NULL),(9,NULL,'2020-07-09',NULL),(10,NULL,'2020-07-10',NULL),(11,NULL,'2020-07-11',NULL),(12,NULL,'2020-07-12',NULL),(13,NULL,'2020-07-13',NULL),(14,NULL,'2020-07-14',NULL),(15,NULL,'2020-07-15',NULL),(16,NULL,'2020-07-16',NULL);
/*!40000 ALTER TABLE `dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `image_id` int NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `image` longblob NOT NULL,
  `property_id` int DEFAULT NULL,
  PRIMARY KEY (`image_id`),
  UNIQUE KEY `image_id_UNIQUE` (`image_id`),
  KEY `property_id` (`image_id`,`property_id`),
  CONSTRAINT `property_id` FOREIGN KEY (`image_id`, `property_id`) REFERENCES `properties` (`image_id`, `property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `property_id` int NOT NULL,
  `property_name` varchar(30) NOT NULL,
  `capacity` int DEFAULT NULL,
  `price_per_night` double NOT NULL,
  `property_type` enum('Villa','Studio','Maisonette','House','Apartment') NOT NULL,
  `availability_dates` int NOT NULL,
  `beds` int DEFAULT NULL,
  `bathrooms` int DEFAULT NULL,
  `bedrooms` int DEFAULT NULL,
  `description` mediumtext,
  `extras` mediumtext,
  `size` float DEFAULT NULL,
  `host_id` int NOT NULL,
  `image_id` int DEFAULT NULL,
  `street_name` varchar(20) NOT NULL,
  `area` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  PRIMARY KEY (`property_id`,`availability_dates`),
  UNIQUE KEY `property_id_UNIQUE` (`property_id`),
  KEY `image_id` (`image_id`),
  KEY `host` (`host_id`),
  CONSTRAINT `host` FOREIGN KEY (`host_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'Aegean Colors',2,145,'Villa',1,3,2,1,'Villa Aegean Colors is located in the area of ”Lagades” 2.3 km from the city and port of Tinos, while Agios Fokas Beach is just 900 meters away.',NULL,160,2,NULL,'Agios Fokas','Tinos, Cyclades','Greece'),(2,'Blue Marble',3,120,'House',3,2,1,2,'Blue Marble Villa is a ground floor villa with entrance from the arched inner corridor.  Opened balcony doors facing the communal pool.',NULL,200,3,NULL,'Agios Fokas','Tinos, Cyclades','Greece'),(3,'Calm & Nature',170,138,'Maisonette',3,3,2,2,'Located just outside the scenic village of Mesi, Calm & Nature offers the authentic experience of Tinos. Nested in the center of Tinos island, with minutes access to 3 of Tinos most beautiful villages and some of Tinos most impressive landscapes, Calm & Nature is the ideal place to get away from it all.',NULL,200,3,NULL,'Mesi','Tinos, Cyclades','Greece'),(4,'Grace My Lady',2,60,'Apartment',4,1,1,1,'Grace My Lady (65 Sqm) is a charming summer house with a cozy living room, outdoor seating and a fully equipped kitchen on the first floor.',NULL,65,2,NULL,'Agios Fokas','Tinos, Cyclades','Greece'),(5,'Grace Princess Villa',4,200,'Villa',6,3,2,3,'Grace Princess villa (100 Sqm) is a vibrant maisonette with two bedrooms, two bathrooms and a cozy living room. The decoration is contemporary. ',NULL,100,2,NULL,'Agios Fokas','Tinos, Cyclades','Greece'),(6,'Grace Queen',NULL,130,'Apartment',6,3,2,2,'Situated at the first slopes of Agios Fokas Tinos, Grace Villas estate, enjoys panoramic views of the Aegean Sea and nearby islands on a 180 degrees basis.',NULL,100,3,NULL,'Agios Fokas','Tinos, Cyclades','Greece'),(7,'Green Marble',5,300,'Villa',7,4,3,3,'Ground floor house overlooking the sea, built with marble and Tinian stone. Green Marble with its covered veranda and direct access to the complex’s gardens can comfortably',NULL,250,3,NULL,'Oia','Santorini, Cyclades','Greece');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `reservation_id` int NOT NULL,
  `user_id` int NOT NULL,
  `from_date` int NOT NULL,
  `number_of_dates` int NOT NULL,
  `property_id` int NOT NULL,
  PRIMARY KEY (`reservation_id`,`user_id`,`property_id`,`from_date`),
  UNIQUE KEY `reservation_ID_UNIQUE` (`reservation_id`) /*!80000 INVISIBLE */,
  KEY `user_id` (`user_id`),
  KEY `property_id_idx` (`property_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,4,7,1,7),(2,5,6,2,6);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `user_id` int NOT NULL,
  `property_id` int NOT NULL,
  `stars` int NOT NULL,
  `comments` mediumtext,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`review_id`,`property_id`,`user_id`),
  UNIQUE KEY `review_id_UNIQUE` (`review_id`),
  KEY `property` (`property_id`),
  KEY `user` (`user_id`),
  CONSTRAINT `property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`property_id`),
  CONSTRAINT `user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,7,4,'Really great!','2020-06-21'),(3,4,3,3,'Ok','2020-05-30');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `first_name` varchar(45) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `tel` bigint DEFAULT NULL,
  `role` enum('tenant','host','admin') NOT NULL,
  `image_id` int DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `image_id` FOREIGN KEY (`image_id`) REFERENCES `images` (`image_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'effie','12345EP','Effie','Pitaouli','dummy@gmail.com',306911111111,'admin',NULL),(2,'sevi','1234sP','Sevi','Pitaouli','dummy1@gmail.com',306900000000,'host',NULL),(3,'sheldon','12345sc','Sheldon','Cooper','dummy2@gmail.com',306922222222,'host',NULL),(4,'george','12345gL','George','Lucas','dummy3@gmail.com',306933333333,'tenant',NULL),(5,'mario','12345mT','Mario','Tortelini','dummy4@gmail.com',306944444444,'tenant',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-30  1:12:47
