package org.jointheleague.api.cheetah.Cheetah_Search.presentation;

import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.LocResponse;
import org.jointheleague.api.cheetah.Cheetah_Search.service.LocService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class LocControllerTest {

    private LocController locController;

    @Mock
    private LocService locService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        locController = new LocController(locService);
    }

    @Test
    void whenGetResults_thenReturnLocResult() {
        //given
        String query = "java";
        LocResponse expectedLocResponse = new LocResponse();

        when(locService.getResults(query))
                .thenReturn(expectedLocResponse);

        //when
        LocResponse actualLocResponse = locController.getResults(query);

        //then
        assertEquals(expectedLocResponse, actualLocResponse);
    }

}
