terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"
}

module "database" {
  source = "./modules/database"
}

module "api" {
  source     = "./modules/api"
  depends_on = [module.database]
}