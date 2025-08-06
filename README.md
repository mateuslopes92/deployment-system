# This repo aims create a deployment system for study purposes
I will build a deployment system with the following tools:
Jenkins (Automate CI/CD)
Helm (Package Manager for Kubernetes)
OpenTofu (Create k8s clusters and infra)
Minikub or other kubernetes cluster manager (Container orchestration)
Prometheus (Metrics collection system)
Grafana (Dashboard and alerts -> metrics from prometheus)

The infra will be organized like this:

2 Kubernetes clusters (or 1 cluster with 2 namespaces):
 ├── infra (namespace)
 │   ├── Jenkins
 │   ├── Prometheus
 │   ├── Grafana
 │   └── (optional: OpenTofu runner)
 └── apps (namespace)
     └── sample application(s)
         ├── Helm deployed
         ├── Auto-monitored with Prometheus/Grafana
         └── Tested before deployment

## Step by Step
First thing i did was install the required tools with brew:

```
brew install --cask minikube
brew install kubectl helm opento fu jenkins terraform
```

### starting a local kubernetes cluster:
```
minikube start --driver=docker
```

### Provisioning Infra with OpenTofu(IaC Infrastructure as code)
Create the terraform file to create the namespaces `infra` and `apps` and use opentofu to `init, plan and appy` example (`tofu init`)

#### main.tf
```
provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_namespace" "infra" {
  metadata {
    name = "infra"
  }
}

resource "kubernetes_namespace" "apps" {
  metadata {
    name = "apps"
  }
}
```

