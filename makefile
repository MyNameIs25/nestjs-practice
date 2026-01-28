.PHONY: up down log-reservations log-auth

up:
	docker-compose up --build -d

down:
	docker-compose down

log-reservations:
	docker-compose logs -f reservations

log-auth:
	docker-compose logs -f auth