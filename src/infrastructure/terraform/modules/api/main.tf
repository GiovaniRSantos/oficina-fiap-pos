resource "kubernetes_secret" "oficina_secret" {
  metadata {
    name = "oficina-secret"
  }
  data = {
    DATABASE_URL = "postgresql://postgres:postgres@db:5432/oficina"
    JWT_SECRET   = "supersecret"
  }
}

resource "kubernetes_config_map" "oficina_config" {
  metadata {
    name = "oficina-config"
  }
  data = {
    NODE_ENV = "production"
  }
}

resource "kubernetes_deployment" "api" {
  metadata {
    name = "oficina-api"
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "oficina-api" }
    }
    template {
      metadata {
        labels = { app = "oficina-api" }
      }
      spec {
        container {
          name  = "api"
          image = "oficina-api:latest"
          port { container_port = 3000 }
          resources {
            requests = { cpu = "100m" }
            limits   = { cpu = "500m" }
          }
          env {
            name = "DATABASE_URL"
            value_from {
              secret_key_ref {
                name = "oficina-secret"
                key  = "DATABASE_URL"
              }
            }
          }
          env {
            name = "JWT_SECRET"
            value_from {
              secret_key_ref {
                name = "oficina-secret"
                key  = "JWT_SECRET"
              }
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name = "oficina-api-service"
  }
  spec {
    selector = { app = "oficina-api" }
    type     = "LoadBalancer"
    port {
      port        = 80
      target_port = 3000
    }
  }
}

resource "kubernetes_horizontal_pod_autoscaler_v2" "api_hpa" {
  metadata {
    name = "oficina-api-hpa"
  }
  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = "oficina-api"
    }
    min_replicas = 1
    max_replicas = 5
    metric {
      type = "Resource"
      resource {
        name = "cpu"
        target {
          type                = "Utilization"
          average_utilization = 50
        }
      }
    }
  }
}