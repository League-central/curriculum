package org.jointheleague.api.cheetah.Cheetah_Search.presentation;

import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.LocResponse;
import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.Result;
import org.jointheleague.api.cheetah.Cheetah_Search.service.LocService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

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
    void givenGoodQuery_whenGetResults_thenReturnListOfResults() {
        //given
        String query = "Java";
        Result result = new Result();
        result.setTitle("TITLE");
        result.setLink("LINK");
        result.setAuthors(Collections.singletonList("AUTHORS"));
        List<Result> expectedResults = Collections.singletonList(result);

        when(locService.getResults(query))
                .thenReturn(expectedResults);

        //when
        List<Result> actualResults = locController.getResults(query);

        //then
        assertEquals(expectedResults, actualResults);
    }

    @Test
    void givenBadQuery_whenGetResults_thenThrowsException() {
        //given
        String query = "Java";

        //when
        //then
        Throwable exceptionThrown = assertThrows(ResponseStatusException.class, () -> locController.getResults(query));
        assertEquals(exceptionThrown.getMessage(), "404 NOT_FOUND \"Result(s) not found.\"");
    }

}
