provider "kubernetes" {
	config_path		= "C:\\Users\\Lilac\\.kube\\config"
	config_context	= "docker-desktop"
}

resource "kubernetes_deployment" "server" {
	metadata {
		name = "server"
		namespace = "default"
		labels = {
			app = "server"
		}
	}

	spec {
		replicas = 1

		selector {
			match_labels = {
				app = "server"
			}
		}

		template {
			metadata {
				labels = {
					app = "server"
				}
			}

			spec {
				container {
					name = "server"
					image = "lilac764/server-repo:latest"
					image_pull_policy = "Always"
					
					env_from {
						config_map_ref {
						name = "server-config"
						}
					}

					port {
						container_port = 5000
						host_port = 5000
						protocol = "TCP"
					}
					
					volume_mount {
						mount_path = "/run/secrets/db-password"
						name = "db-password"
					}

					volume_mount {
						mount_path = "/app"
						name = "server-volume"
					}
				}

				volume {
					name = "db-password"
					secret {
						secret_name = "db-password"
						items {
							key = "db-password"
							path = "db-password"
						}
					}
				}

				volume {
					name = "server-volume"
					host_path {
						path = "server"
					}
				}
			}
		}
	}
}

resource "kubernetes_config_map" "server-config" {
	metadata {
		name = "server-config"
		namespace = "default"
		
		labels = {
			app = "server"
		}
	}

	data = {
		POSTGRES_HOST			= "db"
		POSTGRES_PASSWORD_FILE	= "/run/secrets/db-password/db-password"
		FLASK_APP				= "/app/app.py"
		SECRET_KEY				= "/run/secrets/secret-key"
	}
}

resource "kubernetes_secret" "db-password" {
	metadata {
		name = "db-password"
	}

	data = {
		db-password = "bXlzZWNyZXRwYXNzd29yZA=="
	}

	type = "Opaque"
}

resource "kubernetes_secret" "secret-key" {
	metadata {
		name = "secret-key"
	}

	data = {
		secret-key = "MmUxMjAyOTdhYThjYTUwMzg2NmI0NGZkMjg4Mzg5NGUyODhlYWQxYTkyNGY1N2E1ZWFiOTkxOWNkY2Q4ZDk3YQ=="
	}

	type = "Opaque"
}

resource "kubernetes_service" "server-service" {
	metadata {
		name = "server-service"
		namespace = "default"
		labels = {
			app = "server"
		}
	}

	spec {
		selector = {
			app = "server"
		}
		type = "ClusterIP"

		port {
			protocol = "TCP"
			port = 5000
			target_port = 5000
		}
	}
}

resource "kubernetes_config_map" "db-config" {
	metadata {
		name = "db-config"
		namespace = "default"
		
		labels = {
			app = "db"
		}
	}

	data = {
		POSTGRES_DB				= "feedback_db"
		POSTGRES_PASSWORD_FILE	= "/run/secrets/db-password/db-password"
		POSTGRES_USER			= "postgres"
		PGUSER					= "postgres"
	}
}

resource "kubernetes_deployment" "db" {
	metadata {
		name = "db"
		namespace = "default"
		labels = {
			app = "db"
		}
	}

	spec {
		replicas = 1

		selector {
			match_labels = {
				app = "db"
			}
		}

		template {
			metadata {
				labels = {
					app = "db"
				}
			}

			spec {
				container {
					name = "db"
					image = "lilac764/db-repo:latest"
					image_pull_policy = "Always"

					liveness_probe {
						exec {
							command = ["pg_isready"]
						}

						failure_threshold = 5
						period_seconds = 10
						timeout_seconds = 5
					}

					env_from {
						config_map_ref {
						name = "db-config"
						}
					}

					port {
						container_port = 5432
						protocol = "TCP"
						name = "db"
					}
					
					volume_mount {
						mount_path = "/run/secrets/db-password"
						name = "db-password"
					}

					volume_mount {
						mount_path = "/var/lib/postgresql/data"
						name = "db-data"
					}

					volume_mount {
						mount_path = "/docker-entrypoint-initdb.d/"
						name = "db-volume"
					}
				}

				volume {
					name = "db-password"
					secret {
						secret_name = "db-password"
						items {
							key = "db-password"
							path = "db-password"
						}
					}
				}

				volume {
					name = "db-volume"
					host_path {
						path = "db"
					}
				}

				volume {
					name = "db-data"
					persistent_volume_claim {
						claim_name = "db-data"
					}
				}
			}
		}
	}
}

resource "kubernetes_persistent_volume_claim" "db-data" {
	metadata {
		name = "db-data"
	}

	spec {
		access_modes = ["ReadWriteOnce"]

		resources {
			requests = {
				storage = "5Gi"
			}
		}
	}
}

resource "kubernetes_service" "db-service" {
	metadata {
		name = "db-service"
	}

	spec {
		selector = {
			app = "db"
		}
		type = "ClusterIP"

		port {
			name = "5432"
			port = 5432
			target_port = 5432
		}
	}
}

resource "kubernetes_service" "client-service" {
	metadata {
		name = "client-service"
		namespace = "default"
		labels = {
			app = "client"
		}
	}

	spec {
		selector = {
			app = "client"
		}
		type = "LoadBalancer"
		load_balancer_ip = "127.0.0.1"

		port {
			protocol = "TCP"
			port = 3000
			target_port = 3000
		}
	}
}

resource "kubernetes_deployment" "client" {
	metadata {
		name = "client"
		namespace = "default"
		labels = {
			app = "client"
		}
	}

	spec {
		replicas = 1

		selector {
			match_labels = {
				app = "client"
			}
		}

		template {
			metadata {
				labels = {
					app = "client"
				}
			}

			spec {
				container {
					name = "client"
					image = "lilac764/client-repo:latest"
					image_pull_policy = "Always"

					port {
						container_port = 3000
						host_port = 3000
						protocol = "TCP"
					}
					
					volume_mount {
						mount_path = "/user/src/app"
						name = "client-volume"
					}
				}

				volume {
					name = "client-volume"
					persistent_volume_claim {
						claim_name = "client-volume"
					}
				}
			}
		}
	}
}

resource "kubernetes_persistent_volume" "client-volume" {
	metadata {
		name = "client-volume"
		labels = {
			type = "local"
		}
	}

	spec {
		storage_class_name = "hostpath"
		
		capacity = {
			storage = "100Mi"
		}

		access_modes = ["ReadWriteOnce"]
		claim_ref {
			namespace = "default"
			name = "client-volume"
		}
		persistent_volume_source {
			host_path {
				path = "client"
			}
		}
	}
}

resource "kubernetes_persistent_volume_claim" "client-volume" {
	metadata {
		name = "client-volume"
	}

	spec {
		access_modes = ["ReadWriteOnce"]
		resources {
			requests = {
				storage = "100Mi"
			}
		}
	}
}