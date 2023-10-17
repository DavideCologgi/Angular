package com.eventify.app.controller.api;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventify.app.model.Event;
import com.eventify.app.model.User;
import com.eventify.app.model.enums.Categories;
import com.eventify.app.model.json.EventRegistrationDto;
import com.eventify.app.repository.IEventRepository;
import com.eventify.app.service.EventService;
import com.eventify.app.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EventController {

    private final IEventRepository eventRepository;
    private final EventService eventService;
    private final UserService userService;

    @PostMapping("/api/create-event")
    public ResponseEntity<String> createEvent(@RequestBody EventRegistrationDto eventRegistrationDto) {
        try {
            String dateString = eventRegistrationDto.dateTime();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime localDateTime = LocalDateTime.parse(dateString, formatter);
            Event createdEvent = Event.builder().place(eventRegistrationDto.place()).dateTime(localDateTime).build();
            return ResponseEntity.status(HttpStatus.CREATED).body("Event created with ID: " + createdEvent.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating the event: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/event/delete/{eventId}")//@PathVariable serve a ottenere il valore dell'ID dell'evento direttamente dall'URL della richiesta.
    public ResponseEntity<String> deleteEvent(@PathVariable Long eventId) {
        try {
            if (eventRepository.existsById(eventId)) {
                eventRepository.deleteById(eventId);
                return ResponseEntity.ok("Event deleted with ID: " + eventId);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting the event: " + e.getMessage());
        }
    }

    @GetMapping("/api/event/findBy-title")
    public ResponseEntity<Optional<Event>> findEventsByTitle(@RequestParam String title) {
        Optional<Event> event = eventService.findByTitle(title);
        if (!event.isEmpty()) {
            return ResponseEntity.ok(event);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/event/findBy-datetime-interval")
    public ResponseEntity<List<Event>> findEventsByDateTimeInterval(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        List<Event> events = eventService.findEventsByDateTimeInterval(startTime, endTime);
        if (!events.isEmpty()) {
            return ResponseEntity.ok(events);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/event/findBy-place")
    public ResponseEntity<List<Event>> findEventsByPlace(@RequestParam String place) {
        List<Event> events = eventService.findEventsByPlace(place);
        if (!events.isEmpty()) {
            return ResponseEntity.ok(events);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/api/event/findBy-category")
    public ResponseEntity<List<Event>> findEventsByCategory(@RequestParam Categories category) {
        List<Event> events = eventService.findEventsByCategory(category);
        if (!events.isEmpty()) {
            return ResponseEntity.ok(events);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/api/event/{eventId}/register")
    public ResponseEntity<String> registerForEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);
        Optional<User> userOptional = userService.getById(userId);

        if (eventOptional.isPresent() && userOptional.isPresent()) {
            Event event = eventOptional.get();
            User user = userOptional.get();
            List<User> participants = event.getParticipants();

            participants.add(user);
            event.setParticipants(participants);
            eventService.updateEvent(event);
            return ResponseEntity.status(HttpStatus.CREATED).body("L'utente è stato registrato per l'evento.");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/api/event/{eventId}/unregister/{userId}")
    public ResponseEntity<String> unregisterFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            List<User> participants = event.getParticipants();

            if (participants.size() == 0) {
                boolean removed = participants.removeIf(participant -> participant.getId().equals(userId));

                if (removed) {
                    event.setParticipants(participants);
                    eventService.updateEvent(event);
                    return ResponseEntity.ok("L'utente è stato cancellato dall'evento.");
                }
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("L'utente non è registrato per l'evento.");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/api/event/{eventId}/participants")
    public ResponseEntity<List<User>> getEventParticipants(@PathVariable Long eventId) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            List<User> participants = event.getParticipants();
            if (participants.size() == 0) {
                return ResponseEntity.ok(participants);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/api/user/{userId}/created-events")
    public ResponseEntity<List<Event>> getCreatedEvents(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Event> createdEvents = eventService.getEventsCreatedByUser(user);
            return ResponseEntity.ok(createdEvents);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/api/user/{userId}/registered-events")
    public ResponseEntity<List<Event>> getRegisteredEvents(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Event> registeredEvents = eventService.getEventsRegisteredByUser(user);
            return ResponseEntity.ok(registeredEvents);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/api/event/{eventId}/change-title")
    public ResponseEntity<String> changeEventTitle(@PathVariable Long eventId, @RequestParam String newTitle) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setTitle(newTitle);
            eventService.updateEvent(event);
            return ResponseEntity.ok("Titolo dell'evento modificato con successo.");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/api/event/{eventId}/change-description")
    public ResponseEntity<String> changeEventDescription(@PathVariable Long eventId, @RequestParam String newDescription) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setDescription(newDescription);
            eventService.updateEvent(event);
            return ResponseEntity.ok("Descrizione dell'evento modificata con successo.");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/api/event/{eventId}/change-date-time")
    public ResponseEntity<String> changeEventDateTime(@PathVariable Long eventId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime newDateTime) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setDateTime(newDateTime);
            eventService.updateEvent(event);
            return ResponseEntity.ok("Data e ora dell'evento modificate con successo.");
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/api/event/{eventId}/change-category")
    public ResponseEntity<String> changeEventCategory(@PathVariable Long eventId, @RequestParam Categories newCategory) {
        Optional<Event> eventOptional = eventService.getEventById(eventId);

        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setCategory(newCategory);
            eventService.updateEvent(event);
            return ResponseEntity.ok("Categoria dell'evento modificata con successo.");
        }
        return ResponseEntity.notFound().build();
    }
}
