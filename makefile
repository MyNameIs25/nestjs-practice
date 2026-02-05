.PHONY: up down log-reservations log-auth log-payments log-notifications log-gateway

up:
	docker-compose up --build -d

down:
	docker-compose down

log-reservations:
	docker-compose logs -f reservations

log-auth:
	docker-compose logs -f auth

log-payments:
	docker-compose logs -f payments

log-notifications:
	docker-compose logs -f notifications

log-gateway:
	docker-compose logs -f gateway