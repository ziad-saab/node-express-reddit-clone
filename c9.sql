-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: reddit_clone
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.14.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `parentId` (`parentId`),
  KEY `userId` (`userId`),
  KEY `contentId` (`contentId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`parentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`contentId`) REFERENCES `contents` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'He\'s a pretty cool guy.','2016-02-27 03:17:49','2016-02-27 03:17:49',NULL,2,2),(2,'True, true.','2016-02-27 03:22:17','2016-02-27 03:22:17',1,1,2),(3,'noice','2016-02-27 03:45:06','2016-02-27 03:45:06',NULL,3,2),(4,'SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT SUPER HOT','2016-02-27 03:47:22','2016-02-27 03:47:22',NULL,3,1),(5,'Top quality post.','2016-02-27 03:49:20','2016-02-27 03:49:20',NULL,2,3),(6,'very spicy','2016-02-27 04:25:16','2016-02-27 04:25:16',4,2,1),(7,'peculiar site','2016-02-27 23:50:01','2016-02-27 23:50:01',NULL,5,1),(8,'ya did it.','2016-02-27 23:51:11','2016-02-27 23:51:11',7,2,1),(9,'I am interested in this site for unknown reasons','2016-02-27 23:53:06','2016-02-27 23:53:06',8,5,1),(10,'hello','2016-02-27 23:54:21','2016-02-27 23:54:21',8,2,1);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentvotes`
--

DROP TABLE IF EXISTS `commentvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commentvotes` (
  `upVote` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `commentId` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`commentId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `commentvotes_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commentvotes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentvotes`
--

LOCK TABLES `commentvotes` WRITE;
/*!40000 ALTER TABLE `commentvotes` DISABLE KEYS */;
INSERT INTO `commentvotes` VALUES (1,'2016-02-27 03:22:20','2016-02-27 03:22:28',1,1),(1,'2016-02-27 03:17:49','2016-02-27 03:17:49',1,2),(1,'2016-02-27 03:45:08','2016-02-27 03:45:08',1,3),(1,'2016-02-27 03:22:17','2016-02-27 03:22:17',2,1),(1,'2016-02-27 03:26:55','2016-02-27 03:26:55',2,2),(1,'2016-02-27 03:45:09','2016-02-27 03:45:09',2,3),(1,'2016-02-27 03:51:54','2016-02-27 03:51:54',3,2),(1,'2016-02-27 03:45:06','2016-02-27 03:45:06',3,3),(1,'2016-02-27 03:51:20','2016-02-27 03:51:20',4,2),(1,'2016-02-27 03:47:22','2016-02-27 03:47:22',4,3),(1,'2016-02-27 03:49:20','2016-02-27 03:49:20',5,2),(1,'2016-02-27 04:25:16','2016-02-27 04:25:16',6,2),(1,'2016-02-27 23:50:20','2016-02-28 00:33:15',7,2),(1,'2016-02-27 23:50:01','2016-02-27 23:50:01',7,5),(1,'2016-02-27 23:51:11','2016-02-27 23:51:11',8,2),(0,'2016-02-27 23:53:15','2016-02-27 23:53:15',9,2),(0,'2016-02-27 23:53:06','2016-02-27 23:54:01',9,5),(1,'2016-02-27 23:54:21','2016-02-27 23:54:21',10,2);
/*!40000 ALTER TABLE `commentvotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contents`
--

DROP TABLE IF EXISTS `contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `contents_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contents`
--

LOCK TABLES `contents` WRITE;
/*!40000 ALTER TABLE `contents` DISABLE KEYS */;
INSERT INTO `contents` VALUES (1,'http://www.maddox.com','the best page in the universe','2016-02-26 20:50:32','2016-02-26 20:50:32',1),(2,'http://imgur.com/r/aww/YMwEV2X','Welcome Y. Han!','2016-02-27 03:17:37','2016-02-27 03:17:37',2),(3,'https://reddit-clone-crismark.c9users.io','fuggedabouddit','2016-02-27 03:47:54','2016-02-27 03:47:54',3),(4,'http://www.theglobeandmail.com/news/world/clinton-eyes-big-win-in-south-carolina-sanders-shifts-focus/article28939967/','Clinton eyes big win in South Carolina; Sanders shifts focus','2016-02-27 23:38:42','2016-02-27 23:38:42',2),(5,'http://www.theglobeandmail.com/news/world/clinton-eyes-big-win-in-south-carolina-sanders-shifts-focus/article28939967/','Clinton eyes big win in South Carolina; Sanders shifts focus','2016-02-27 23:39:07','2016-02-27 23:39:07',2),(6,'http://www.theglobeandmail.com/news/british-columbia/refinery-plans-in-bc-and-alberta-seek-to-tip-over-conventionalwisdom/article28937454/','refinery plans in bc and alberta seek to tip over conventionalwisdom','2016-02-27 23:41:32','2016-02-27 23:41:32',2),(7,'http://www.bbc.com','bbc.com','2016-02-27 23:57:37','2016-02-27 23:57:37',5);
/*!40000 ALTER TABLE `contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'949e5019f8e11780bd78a0cd455aaa98fde79ac8e5f0f2fdbd619d3993cdef31e19ac7f2f4b484e8','2016-02-26 20:50:14','2016-02-26 20:50:14',1),(2,'144bef331d7e62991f13e4224ca4162a52e086b19e9661ef5bd5572cbb596ea2affb4e99f6afab','2016-02-27 03:16:49','2016-02-27 03:16:49',2),(3,'e11ff5e19b2d129bd437a238d306b1d2b1d286e11d5115a68ca6572589ec5b821cd794af810','2016-02-27 03:21:40','2016-02-27 03:21:40',1),(4,'a82b5a52f9611a62e653fbe7cbafe9cf18736d8349af6b9ac6bcd54663c923eb671e119c5d21ef','2016-02-27 03:26:23','2016-02-27 03:26:23',2),(5,'0bf64ec2d8482aac59cb54e7f83e3a24b60243730c93c33b83df8ce6892385ed39af2f68a67','2016-02-27 03:44:54','2016-02-27 03:44:54',3),(6,'9d19c11ef812ee33b53a5c909bfab43cdcf0cb151bc2ba1492e22be29994f18cfa91d0c5ba3a1194','2016-02-27 03:49:08','2016-02-27 03:49:08',2),(7,'235b3f895cadf0ff015d36555fd762b79bb48c9f558e0a07bbe6533281e588ba1fb3fca5da1f82','2016-02-27 23:38:42','2016-02-27 23:38:42',2),(8,'4140a9fbf2c8fc7e0b94254d9def6288072ad86853f53c2704b6428a483713faa1bccf8f532db4f','2016-02-27 23:45:25','2016-02-27 23:45:25',5);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'mme_bqdequ','$2a$10$N9FXdLXKJk2xu3M05sOeyug5/JCCDo/Hqvi9hz4QBeQBoQz938KRW','','2016-02-26 20:50:14','2016-02-26 20:50:14'),(2,'hanfan72','$2a$10$.bT/GPKm0.WKe5z8QChGnuheg3gN3Vn5fCOwtROFavcuEfbeouJ2u','','2016-02-27 03:16:48','2016-02-27 03:16:48'),(3,'foobar','$2a$10$HtaYTgn6lZLAIHCQqAcfvOEeTkzoDWyLO.q6ySigKb9.8Bly/Y1Cy','','2016-02-27 03:44:53','2016-02-27 03:44:53'),(5,'david','$2a$10$VlF45cMfFjj9VMuRQNgh1On4IWEBGS1w3yTXLfZydGR8K2o.Fqu52','davidtcrisp@gmail.com','2016-02-27 23:45:24','2016-02-27 23:45:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `upVote` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `contentId` int(11) NOT NULL DEFAULT '0',
  `userId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`contentId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`contentId`) REFERENCES `contents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (0,'2016-02-26 20:50:33','2016-02-27 03:26:05',1,1),(0,'2016-02-27 03:26:27','2016-02-27 03:26:27',1,2),(1,'2016-02-27 03:47:35','2016-02-27 04:01:35',1,3),(1,'2016-02-27 03:21:45','2016-02-27 03:21:45',2,1),(1,'2016-02-27 03:17:37','2016-02-27 03:17:37',2,2),(1,'2016-02-27 03:49:13','2016-02-27 04:05:25',3,2),(1,'2016-02-27 03:47:54','2016-02-27 03:48:02',3,3),(1,'2016-02-27 23:46:22','2016-02-27 23:48:14',3,5),(1,'2016-02-27 23:38:42','2016-02-27 23:38:42',4,2),(1,'2016-02-27 23:39:07','2016-02-27 23:39:07',5,2),(1,'2016-02-27 23:41:32','2016-02-27 23:41:32',6,2),(1,'2016-02-27 23:57:50','2016-02-27 23:57:50',7,2),(1,'2016-02-27 23:57:37','2016-02-27 23:57:37',7,5);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-28  5:43:58
