package com.eventify.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eventify.app.model.Event;

public interface IEventRepository extends JpaRepository<Event, Long> {
}


