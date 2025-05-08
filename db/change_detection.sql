-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: change_detection
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

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
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT 'sammm',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('test123','Test Title','This is a dummy notification.','2025-05-08 15:28:12','Hyderabad','17.3850440','78.4866710','sammm');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_requests`
--

DROP TABLE IF EXISTS `permission_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `locations` varchar(255) DEFAULT NULL,
  `justification` text,
  `supervisor_info` text,
  `additional_comments` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_requests`
--

LOCK TABLES `permission_requests` WRITE;
/*!40000 ALTER TABLE `permission_requests` DISABLE KEYS */;
INSERT INTO `permission_requests` VALUES (1,'sam','sam@sam.in','0987654321','lkjhgfds','likhygfd','l,k,j,h,g,f,v,d,c,s','k,jhngfvdc','jhngbfvdcsx','j,mhnbfvdc','2025-05-04 08:44:40','approved'),(2,'Sam Test','sam@example.com','1234567890','Engineering','Intern','A1,B2,C3','Need access for testing','Supervisor XYZ','No comments','2025-05-05 04:15:49','approved'),(3,'sammm','sam@sam.in','0987654321','ABC','ABC','T,e,s,t','Project','ABC','','2025-05-05 05:44:11','rejected'),(4,'sammm','abc@amc.in','0987654321','xyz','abc','G,o,a','Project','ABCD','','2025-05-05 05:48:33','rejected'),(5,'sammm','abc@amc.in','0987654321','xyz','abc','D,e,l,h,i','Project','ABCD','','2025-05-05 05:48:49','approved'),(6,'sammm','sam@sam.in','0987654321','abc','asdf','q,w,s,e,f,g,h','asdfg','asdfgb','','2025-05-05 05:54:38','approved'),(7,'sammm','sam@sam.in','0987654321','abc','asdf','q,w,s,e,f,g,h','asdfg','asdfgb','','2025-05-05 05:54:45','rejected'),(8,'samriddhi','a@a.in','0987654321','lkjhgfdsa','poiuytrewq','o,i,u,y,t,r,e,w','lkjhgfdsd','l.o,kijhgfd','','2025-05-05 06:33:25','approved'),(9,'asdf','a@a.in','1234567890','wertghjk','sdfghjmk,','q,w,s,d,g,h,j,k,,,l,.','asdghjkl.;','asdfghjk,l','','2025-05-05 06:41:53','approved'),(10,'sammm','sam@sam.in','0987654321','qwerty','ytrewwq','a,s,d,f,g','gfdsa','hgfds','','2025-05-06 14:20:22','approved'),(11,'sammm','sam@sam.in','0987654321','kjhgfdsa','asdfghjkl;','a,b,c','asdfghjk','jhgfds','','2025-05-06 14:34:14','approved'),(12,'sam','sam@sam.in','1234567890','abc','abc','a,b,c','abc','abc','','2025-05-06 14:37:32','rejected'),(13,'sam','a@a.in','0987654321','abc','abc','g,o,a','abc','acnk','','2025-05-06 14:45:16','pending');
/*!40000 ALTER TABLE `permission_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `regions` varchar(255) DEFAULT NULL,
  `access_reason` text,
  `supervisor_contact` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Samriddhi','sammm@admin.roadmonitor.in','123456789','admin','student','abc','samm','qwerty123','','',''),('Samriddhi Singh','sammm@roadmonitor.in','1234567890','user','Student','abc','sammm','qwerty123','a,b,c','Blah Blah','');
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

-- Dump completed on 2025-05-08 20:25:09
