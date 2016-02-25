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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contents`
--

LOCK TABLES `contents` WRITE;
/*!40000 ALTER TABLE `contents` DISABLE KEYS */;
INSERT INTO `contents` VALUES (1,'https://www.youtube.com/','YouTube','2016-02-19 20:30:08','2016-02-19 20:30:08',1),(2,'https://www.google.com','Google','2016-02-19 20:31:06','2016-02-19 20:31:06',1),(3,'https://www.imgur.com','imgur','2016-02-19 20:39:34','2016-02-19 20:39:34',2),(4,'https://news.ycombinator.com','Hacker News','2016-02-19 20:40:37','2016-02-19 20:40:37',2),(5,'https://maps.google.com','Google Maps','2016-02-19 22:08:38','2016-02-19 22:08:38',2),(6,'https://www.twitter.com','Twitter','2016-02-19 23:10:04','2016-02-19 23:10:04',1),(26,'http://www.decodemtl.com','Learn to Code in Montreal | DecodeMTL','2016-02-24 23:03:29','2016-02-24 23:03:29',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (15,'8dfb7b4ed22b8b7abd39e9dd45073811dcc647febedc2b1f55786ca682eee366758ac83dde','2016-02-20 02:14:37','2016-02-20 02:14:37',4),(16,'9af95d3db6b3b9da62b85dbb293a2f106a218794dd649b6ddee6156388e791f243ea44cef72f412','2016-02-20 04:11:32','2016-02-20 04:11:32',5),(21,'1cf870bec5b5b1a321468490d445ea751a2ea50e66b51bc5d8472cff8532cc6aeb4818fcff65c9','2016-02-24 20:52:01','2016-02-24 20:52:01',1);
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
  `username` varchar(255) DEFAULT NULL,
  `passhash` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'bagel','$2a$10$Cjwfgd/ybyX1P0VpTtmJRedZ9pVkv74G.TDVpmZu5niMAoJk1VPDW','2016-02-19 07:18:29','2016-02-19 07:18:29'),(2,'phil','$2a$10$vqc1UY0QodGhk9HsdNETbOuLHXF.YQnxMWU1bt0TA8gok/e/uGBsm','2016-02-19 20:39:17','2016-02-19 20:39:17'),(3,'lobster','$2a$10$/8xGeUV4REd6aZ0rzSz6MeP4uM144I3XzYdqgUfewiPnbBnzDUA6S','2016-02-20 02:14:10','2016-02-20 02:14:10'),(4,'bah','$2a$10$BmzbOvGSlPKVj9NEI5BA6.AEds9arSWl/mWGbK5NJxBpxr1j390Ju','2016-02-20 02:14:37','2016-02-20 02:14:37'),(5,'toes','$2a$10$9s6AuXcUNV/zFKh8VUxFG.4JiC2hFqckooBCfLxb1YVpTDrjXKPUK','2016-02-20 04:11:32','2016-02-20 04:11:32'),(6,'test2','$2a$10$tsx9JjHtgL6jLzyAUqyS/efPDnJDaV/vfAi87aczViwI04yQ/mKbi','2016-02-22 21:09:47','2016-02-22 21:09:47');
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
INSERT INTO `votes` VALUES (1,'2016-02-19 23:05:10','2016-02-22 21:03:03',1,1),(0,'2016-02-19 21:45:24','2016-02-19 21:46:07',1,2),(0,'2016-02-20 02:15:40','2016-02-20 02:15:40',1,4),(1,'2016-02-20 04:13:20','2016-02-20 04:14:28',1,5),(1,'2016-02-19 22:21:40','2016-02-24 20:38:05',2,1),(1,'2016-02-19 22:08:46','2016-02-19 22:08:46',2,2),(1,'2016-02-20 02:16:04','2016-02-20 02:16:04',2,3),(1,'2016-02-20 02:15:34','2016-02-20 02:15:37',2,4),(0,'2016-02-20 04:12:03','2016-02-20 04:12:03',2,5),(1,'2016-02-22 21:09:59','2016-02-22 21:09:59',2,6),(0,'2016-02-19 23:13:25','2016-02-25 03:09:21',3,1),(1,'2016-02-20 02:16:06','2016-02-20 02:16:06',3,3),(1,'2016-02-20 04:12:08','2016-02-20 04:12:08',3,5),(1,'2016-02-22 21:10:15','2016-02-22 21:10:15',3,6),(1,'2016-02-22 20:35:55','2016-02-24 20:38:01',4,1),(1,'2016-02-20 02:15:42','2016-02-20 02:15:42',4,4),(0,'2016-02-20 04:12:06','2016-02-20 04:12:06',4,5),(1,'2016-02-24 20:37:59','2016-02-24 20:37:59',6,1);
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

-- Dump completed on 2016-02-25 17:29:32
