## Unleash

This repository contains a Docker image for the [Unleash feature toggle framework](https://unleash.github.io/).
In particular, it contains the Unleash server that is used by the `carts` microservice, which incorporates some feature toggles for demo purposes.

## How to use

Apply the manifest to your Kubernetes cluster. We recommend using a separate namespace called `unleash` for running the Unleash server.

```console
kubectl apply -f deploy/unleash-server.yaml
```

Access the Unleash server by getting the IP address of it:

```console
kubectl get ingress -n unleash
```
