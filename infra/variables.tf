variable "api_image" {
  default = "oficina-api:latest"
}

variable "api_replicas" {
  default = 1
}

variable "db_name" {
  default = "oficina"
}

variable "db_user" {
  default = "postgres"
}

variable "db_password" {
  default = "postgres"
}