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

### 1 starting a local kubernetes cluster:
```
minikube start --driver=docker
```

### 2 Provisioning Infra with OpenTofu(IaC Infrastructure as code)
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

### 3 Deploy with Jenkins with Helm (to infra)
Adding Helm repo and installing Jenkins
`helm repo add jenkins https://charts.jenkins.io`
`helm repo update`
`helm install jenkins jenkins/jenkins --namespace infra --create-namespace`

Then i got my admin password:
`kubectl exec --namespace infra -it svc/jenkins -c jenkins -- /bin/cat /run/secrets/additional/chart-admin-password && echo`

And got the jenkins URL running:
`echo http://127.0.0.1:8080`
`kubectl --namespace infra port-forward svc/jenkins 8080:8080`
`kubectl --namespace infra get secret jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode`

Then accessing infra
`kubectl port-forward svc/jenkins 8080:8080 -n infra`

this make the url `localhost:8080` available to login on jenkins locally


### 4 Deploy Prometheus and Grafana
adding prometheus:
`helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`
`helm install prometheus prometheus-community/prometheus --namespace infra`

prometheus url: `kubectl --namespace infra port-forward $POD_NAME 9090`
prometheus alert manager cluster: `prometheus-alertmanager.infra.svc.cluster.local`

GRAFANA
adding grafana:
`helm repo add grafana https://grafana.github.io/helm-charts`
`helm install grafana grafana/grafana --namespace infra`
getting grafana password:
`kubectl get secret --namespace infra grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo`\

grafana cluster: `grafana.infra.svc.cluster.local`
grafana url: `kubectl --namespace infra port-forward $POD_NAME 3000`

accessing grafana:
`kubectl port-forward svc/grafana 3000:80 -n infra`
`localhost:3000` to access grafana

### 5 Creating an app + monitoring setup
