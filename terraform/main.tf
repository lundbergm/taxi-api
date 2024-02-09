locals {
  project         = "dev-taxi-api"
  location        = "EU"
  region          = "europe-north1"
}

terraform {
  backend "gcs" {
    prefix = "taxi-api"
    bucket = "terraform"
  }
}

provider "google" {
  project = local.project
  region  = local.region
}

resource "google_project" "project" {
  name       = locals.project
  project_id = locals.project
}


resource "google_project_service" "cloud_run_api" {
    project = google_project.project.project_id
    service = "run.googleapis.com"
}

resource "google_cloud_run_v2_service" "taxi_api" {
  name = "taxi-api"
  location = "europe-north1"

    template {
        containers {
            image = "docker.io/library/busybox"
            env { 
                name  = "PORT"
                value = 3000
            }
            env {
                name  = "API_MODE"
                value = "MONGO"
            }
            env {
                name  = "MONGO_CONNECTION_STRING"
                value = "mongodb://127.0.0.1:27017/"
            }
        }
        scaling {
            min_instance_count = 1
            max_instance_count = 10
        }
    }
    traffic {
        type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
        percent = 100
    }
    depends_on = [google_project_service.cloud_run_api]
}

resource "google_cloud_run_v2_service_iam_member" "noauth" {
    location = google_cloud_run_v2_service.taxi_api.location
    name     = google_cloud_run_v2_service.taxi_api.name
    role     = "roles/run.invoker"
    member   = "allUsers"
}