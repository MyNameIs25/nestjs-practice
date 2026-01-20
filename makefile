.PHONY: up down log-reservations

up:
	docker-compose up --build -d

down:
	docker-compose down

log-reservations:
	docker-compose logs -f reservations
