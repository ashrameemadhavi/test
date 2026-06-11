-- Smart IT Project Cost Estimation System
-- MySQL Database Schema

CREATE DATABASE IF NOT EXISTS smart_it_estimation
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_it_estimation;

-- Users (Admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Types
CREATE TABLE IF NOT EXISTS project_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  base_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  base_days INT NOT NULL DEFAULT 0,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Features
CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_name VARCHAR(100) NOT NULL UNIQUE,
  cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
  days INT NOT NULL DEFAULT 0,
  complexity_weight DECIMAL(5, 2) NOT NULL DEFAULT 1.0,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Technology Stack Rules (per project type)
CREATE TABLE IF NOT EXISTS technology_stacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_type_id INT NOT NULL,
  frontend VARCHAR(255) NOT NULL,
  backend VARCHAR(255) DEFAULT NULL,
  database_name VARCHAR(255) DEFAULT NULL,
  ai_service VARCHAR(255) DEFAULT NULL,
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_type_id) REFERENCES project_types(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_type_stack (project_type_id)
);

-- Feature-based technology stack overrides
CREATE TABLE IF NOT EXISTS stack_feature_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feature_id INT NOT NULL,
  stack_key ENUM('frontend', 'backend', 'database_name', 'ai_service') NOT NULL,
  stack_value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE,
  UNIQUE KEY unique_feature_stack_key (feature_id, stack_key)
);

-- Client Estimations
CREATE TABLE IF NOT EXISTS estimations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  project_type_id INT NOT NULL,
  total_cost DECIMAL(12, 2) NOT NULL,
  total_days INT NOT NULL,
  complexity ENUM('Simple', 'Medium', 'Complex') NOT NULL,
  technology_stack JSON NOT NULL,
  cost_breakdown JSON NOT NULL,
  timeline_breakdown JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_type_id) REFERENCES project_types(id) ON DELETE RESTRICT
);

-- Estimation Features (junction table)
CREATE TABLE IF NOT EXISTS estimation_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estimation_id INT NOT NULL,
  feature_id INT NOT NULL,
  FOREIGN KEY (estimation_id) REFERENCES estimations(id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_estimation_feature (estimation_id, feature_id)
);

-- Indexes for performance
CREATE INDEX idx_estimations_email ON estimations(email);
CREATE INDEX idx_estimations_created_at ON estimations(created_at);
CREATE INDEX idx_estimations_project_type ON estimations(project_type_id);
CREATE INDEX idx_features_active ON features(is_active);
CREATE INDEX idx_project_types_active ON project_types(is_active);
