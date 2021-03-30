package org.jointheleague.api.cheetah.Cheetah_Search.repository;

import com.fasterxml.jackson.annotation.JsonAlias;
import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.LocResponse;
import org.jointheleague.api.cheetah.Cheetah_Search.repository.dto.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class LocRepositoryTest {

    private LocRepository locRepository;

    @Mock
    WebClient webClientMock;

    @Mock
    WebClient.RequestHeadersUriSpec requestHeadersUriSpecMock;

    @Mock
    WebClient.RequestHeadersSpec requestHeadersSpecMock;

    @Mock
    WebClient.ResponseSpec responseSpecMock;

    @Mock
    Mono<LocResponse> LocResponseMonoMock;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        locRepository = new LocRepository(webClientMock);
    }

    @Test
    void whenGetResults_thenReturnLocResponse() {
        //given
        String query = "Java";
        LocResponse expectedLocResponse = new LocResponse();
        Result result = new Result();
        result.setTitle("Java: A Drink, an Island, and a Programming Language");
        result.setAuthors(Collections.singletonList("AUTHOR"));
        result.setLink("LINK");
        expectedLocResponse.setResults(Collections.singletonList(result));

        when(webClientMock.get())
                .thenReturn(requestHeadersUriSpecMock);
        when(requestHeadersUriSpecMock.uri((Function<UriBuilder, URI>) any()))
                .thenReturn(requestHeadersSpecMock);
        when(requestHeadersSpecMock.retrieve())
                .thenReturn(responseSpecMock);
        when(responseSpecMock.bodyToMono(LocResponse.class))
                .thenReturn(LocResponseMonoMock);
        when(LocResponseMonoMock.block())
                .thenReturn(expectedLocResponse);

        //when
        LocResponse actualLocResponseResponse = locRepository.getResults(query);

        //then
        assertEquals(expectedLocResponse, actualLocResponseResponse);
    }

}
