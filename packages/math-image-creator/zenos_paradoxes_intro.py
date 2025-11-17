from manim import *

class ZenosParadoxesIntro(Scene):
    def construct(self):
        # Section: Introduction
        
        # 1. Display the title "Zeno's Paradoxes"
        title = Text("Zeno's Paradoxes", font_size=72, color=BLUE)
        title.to_edge(UP)
        
        self.play(Write(title))
        self.wait(1)
        
        # 2. Show a simple animation: a person standing at one end of a room, looking towards the other end
        # Create a simple room representation
        room_floor = Line(LEFT * 6, RIGHT * 6, color=WHITE)
        room_floor.to_edge(DOWN, buff=2)
        
        left_wall = Line(LEFT * 6 + DOWN * 2, LEFT * 6 + UP * 2, color=WHITE)
        right_wall = Line(RIGHT * 6 + DOWN * 2, RIGHT * 6 + UP * 2, color=WHITE)
        
        # Create a simple person representation (stick figure)
        person_head = Circle(radius=0.2, color=YELLOW, fill_opacity=1)
        person_body = Line(ORIGIN, DOWN * 1, color=YELLOW)
        person_left_arm = Line(ORIGIN, LEFT * 0.5 + DOWN * 0.3, color=YELLOW)
        person_right_arm = Line(ORIGIN, RIGHT * 0.5 + DOWN * 0.3, color=YELLOW)
        person_left_leg = Line(DOWN * 1, LEFT * 0.3 + DOWN * 1.5, color=YELLOW)
        person_right_leg = Line(DOWN * 1, RIGHT * 0.3 + DOWN * 1.5, color=YELLOW)
        
        person = VGroup(
            person_head,
            person_body,
            person_left_arm,
            person_right_arm,
            person_left_leg,
            person_right_leg
        )
        
        # Position person at left end of room
        person.move_to(LEFT * 4.5 + DOWN * 0.5)
        
        # Create destination point
        destination = Circle(radius=0.3, color=RED, fill_opacity=0.5)
        destination.move_to(RIGHT * 4.5 + DOWN * 1.5)
        destination_label = Text("Goal", font_size=24, color=RED)
        destination_label.next_to(destination, UP)
        
        # Draw the room and person
        self.play(
            Create(room_floor),
            Create(left_wall),
            Create(right_wall),
            FadeIn(person),
            FadeIn(destination),
            Write(destination_label)
        )
        self.wait(1)
        
        # 3. Text appears: "Can you ever truly reach your destination?"
        question_text = Text(
            "Can you ever truly reach your destination?",
            font_size=36,
            color=GREEN
        )
        question_text.to_edge(UP, buff=2)
        
        self.play(Write(question_text))
        self.wait(2)
        
        # Fade out the question
        self.play(FadeOut(question_text))
        
        # 4. Then, an arrow appears, mid-flight, with text: "Is motion even possible?"
        # Create an arrow in mid-flight
        arrow = Arrow(
            start=LEFT * 2,
            end=RIGHT * 2,
            color=ORANGE,
            buff=0
        )
        arrow.move_to(UP * 1.5)
        
        # Motion question text
        motion_question = Text(
            "Is motion even possible?",
            font_size=36,
            color=ORANGE
        )
        motion_question.next_to(arrow, UP, buff=0.5)
        
        # Animate the arrow appearing mid-flight
        self.play(
            GrowArrow(arrow),
            Write(motion_question)
        )
        self.wait(2)
        
        # Add some subtle animation to show the arrow "frozen" in motion
        self.play(
            arrow.animate.shift(RIGHT * 0.2),
            rate_func=there_and_back,
            run_time=0.5
        )
        self.play(
            arrow.animate.shift(LEFT * 0.2),
            rate_func=there_and_back,
            run_time=0.5
        )
        
        self.wait(2)
        
        # Final pause before ending
        self.wait(1)