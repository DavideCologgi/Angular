package com.eventify.app.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.eventify.app.model.Event;
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
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

        try {
            LocalDateTime dateTime = LocalDateTime.parse(event.getDateTime(), formatter);
            Event newEvent = Event.builder()
                .category(event.getCategory())
                .creator(userService.getById(userId).get())
                .dateTime(dateTime)
                .description(event.getDescription())
                .place(event.getPlace())
                .title(event.getTitle())
                .build();
            eventRepository.save(newEvent);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        // for (MultipartFile photo : event.getPhotos()) {
        //     Photo pics = photoService.uploadPhoto(photo);
        //     photoService.create(pics);

        //     if (newEvent.getPhotos() == null) {
        //         newEvent.setPhotos(new ArrayList<>());
        //     }
        //     newEvent.getPhotos().add(pics);
        // }
        // newEvent.setCreator(userService.getById(userId).get());
        // updateEvent(newEvent);
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
