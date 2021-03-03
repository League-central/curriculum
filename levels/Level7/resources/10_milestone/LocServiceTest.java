package org.jointheleague.api.cheetah.Cheetah_Search.service;

import org.jointheleague.api.cheetah.Cheetah_Search.repository.LocRepository;
import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.LocResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class LocServiceTest {

    private LocService locService;

    @Mock
    private LocRepository locRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        locService = new LocService(locRepository);
    }

    @Test
    void whenGetResults_thenReturnLocResult() {
        //given
        String query = "java";
        LocResponse expectedLocResponse = new LocResponse();

        when(locRepository.getResults(query))
                .thenReturn(expectedLocResponse);

        //when
        LocResponse actualLocResponse = locService.getResults(query);

        //then
        assertEquals(expectedLocResponse, actualLocResponse);
    }
    
}
