package com.knowbharat.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "festivals")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Festival {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;
}
