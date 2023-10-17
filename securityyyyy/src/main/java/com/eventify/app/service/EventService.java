package com.eventify.app.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.eventify.app.model.Event;
import com.eventify.app.model.Photo;
import com.eventify.app.model.User;
import com.eventify.app.model.enums.Categories;
import com.eventify.app.model.json.EventForm;
import com.eventify.app.repository.IEventRepository;
import com.eventify.app.validator.EventValidator;
import com.eventify.app.validator.ObjectsValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {

    private final IEventRepository eventRepository;
    private final UserService userService;
    private final PhotoService photoService;
    private final EventValidator eventValidator;
    private final ObjectsValidator<EventForm> validator;

    @Transactional
    public String createEvent(Long userId, EventForm event) throws Exception {
        validator.validate(event);

        String errorMessage = null;
        if ((errorMessage = eventValidator.isFormValid(event)) != null) {
            return (errorMessage);
        }
        Event newEvent = new Event(event.getTitle(), event.getDescription(), event.getDateTime(), event.getPlace(), null, null, null, event.getCategory());
        eventRepository.save(newEvent);

        for (MultipartFile photo : event.getPhotos()) {
            Photo pics = photoService.uploadPhoto(photo);
            photoService.create(pics);

            if (newEvent.getPhotos() == null) {
                newEvent.setPhotos(new ArrayList<>());
            }
            newEvent.getPhotos().add(pics);
        }
        newEvent.setCreator(userService.getById(userId).get());
        updateEvent(newEvent);
        return ("Evento creato con successo");
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
