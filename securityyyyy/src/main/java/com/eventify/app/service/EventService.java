package com.eventify.app.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventify.app.model.Event;
import com.eventify.app.model.User;
import com.eventify.app.model.enums.Categories;
import com.eventify.app.repository.IEventRepository;

@Service
public class EventService {
    @Autowired
    private IEventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event updateEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEventById(Long id) {
        eventRepository.deleteById(id);
    }

    // public Optional<Event> findByTitle(String title) {
    //     List<Event> allEvents = getAllEvents();

    //     for (Event event : allEvents) {
    //         if (event.getTitle().equals(title)) {
    //             return Optional.of(event);
    //         }
    //     }
    //     return Optional.empty();
    // }

    public Optional<Event> findByTitle(String title) {
        return eventRepository.findByTitle(title);
    }

    public List<Event> findEventsByDateTimeInterval(LocalDateTime startTime, LocalDateTime endTime) {
        return eventRepository.findByDateTimeBetween(startTime, endTime);
    }

    public List<Event> findEventsByPlace(String place) {
        return eventRepository.findByPlace(place);
    }

    public List<Event> findEventsByCategory(Categories category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> getEventsCreatedByUser(User user) {
        return eventRepository.findByCreator(user);
    }

    public List<Event> getEventsRegisteredByUser(User user) {
        return eventRepository.findByParticipantsContaining(user);
    }    
}
