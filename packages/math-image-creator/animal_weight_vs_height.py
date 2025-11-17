from manim import *
import numpy as np

class AnimalWeightVsHeight(Scene):
    def construct(self):
        # Title
        title = Text("Wzrost Zwierząt: Wysokość vs Waga", font_size=44, color=BLUE)
        subtitle = Text("Dlaczego słonie są masywne, a myszy malutkie?", font_size=28, color=WHITE)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait()
        
        # Clear title for main content
        self.play(FadeOut(title), FadeOut(subtitle))
        
        # Create visual comparison of animals at different scales
        animals_title = Text("Porównanie zwierząt", font_size=36, color=BLUE)
        animals_title.to_edge(UP)
        self.play(Write(animals_title))
        
        # Create animal representations (simple shapes)
        # Mouse - 10cm
        mouse_height = 0.5
        mouse_body = Rectangle(height=mouse_height, width=mouse_height*0.8, color=GRAY, fill_opacity=0.8)
        mouse_label = Text("Mysz", font_size=20)
        mouse_height_text = Text("10 cm", font_size=16, color=GREEN)
        mouse_weight_text = Text("20 g", font_size=16, color=YELLOW)
        
        # Cat - 30cm (3x height)
        cat_height = 1.5
        cat_body = Rectangle(height=cat_height, width=cat_height*0.8, color=ORANGE, fill_opacity=0.8)
        cat_label = Text("Kot", font_size=20)
        cat_height_text = Text("30 cm", font_size=16, color=GREEN)
        cat_weight_text = Text("4 kg", font_size=16, color=YELLOW)
        
        # Dog - 60cm (6x height)
        dog_height = 3.0
        dog_body = Rectangle(height=dog_height, width=dog_height*0.8, color=LIGHT_BROWN, fill_opacity=0.8)
        dog_label = Text("Pies", font_size=20)
        dog_height_text = Text("60 cm", font_size=16, color=GREEN)
        dog_weight_text = Text("30 kg", font_size=16, color=YELLOW)
        
        # Position animals
        mouse_group = VGroup(mouse_body, mouse_label, mouse_height_text, mouse_weight_text)
        cat_group = VGroup(cat_body, cat_label, cat_height_text, cat_weight_text)
        dog_group = VGroup(dog_body, dog_label, dog_height_text, dog_weight_text)
        
        # Arrange labels
        for animal, body, label, height_text, weight_text in [
            (mouse_group, mouse_body, mouse_label, mouse_height_text, mouse_weight_text),
            (cat_group, cat_body, cat_label, cat_height_text, cat_weight_text),
            (dog_group, dog_body, dog_label, dog_height_text, dog_weight_text)
        ]:
            label.next_to(body, UP, buff=0.2)
            height_text.next_to(body, LEFT, buff=0.2)
            weight_text.next_to(body, RIGHT, buff=0.2)
        
        # Position all animals
        animals = VGroup(mouse_group, cat_group, dog_group)
        animals.arrange(RIGHT, buff=1.5)
        animals.move_to(ORIGIN)
        
        # Align bottoms
        mouse_group.shift(DOWN * (cat_body.get_bottom()[1] - mouse_body.get_bottom()[1]))
        dog_group.shift(DOWN * (cat_body.get_bottom()[1] - dog_body.get_bottom()[1]))
        
        self.play(
            FadeIn(mouse_group),
            FadeIn(cat_group),
            FadeIn(dog_group),
            run_time=2
        )
        self.wait()
        
        # Highlight the relationship
        relationship_text = Text("Wysokość: 1x → 3x → 6x", font_size=24, color=GREEN)
        weight_relationship = Text("Waga: 1x → 200x → 1500x!", font_size=24, color=YELLOW)
        relationship_text.next_to(animals, DOWN, buff=0.8)
        weight_relationship.next_to(relationship_text, DOWN, buff=0.3)
        
        self.play(Write(relationship_text))
        self.play(Write(weight_relationship))
        self.wait(2)
        
        # Clear for mathematical explanation
        self.play(
            FadeOut(animals),
            FadeOut(relationship_text),
            FadeOut(weight_relationship),
            FadeOut(animals_title)
        )
        
        # Mathematical explanation
        math_title = Text("Matematyczne wyjaśnienie", font_size=36, color=BLUE)
        math_title.to_edge(UP)
        self.play(Write(math_title))
        
        # Create cube demonstration
        # Small cube
        small_cube = VGroup()
        small_size = 0.8
        small_cube_3d = Cube(side_length=small_size, fill_opacity=0.7, fill_color=BLUE)
        small_cube_3d.rotate(PI/6, axis=UP)
        small_cube_3d.rotate(PI/8, axis=RIGHT)
        small_cube.add(small_cube_3d)
        
        # Large cube (2x linear dimensions)
        large_cube = VGroup()
        large_size = small_size * 2
        large_cube_3d = Cube(side_length=large_size, fill_opacity=0.7, fill_color=GREEN)
        large_cube_3d.rotate(PI/6, axis=UP)
        large_cube_3d.rotate(PI/8, axis=RIGHT)
        large_cube.add(large_cube_3d)
        
        # Position cubes
        small_cube.shift(LEFT * 3)
        large_cube.shift(RIGHT * 3)
        
        # Labels
        small_label = Text("Wysokość: h", font_size=20, color=BLUE)
        small_label.next_to(small_cube, DOWN, buff=0.5)
        small_volume = MathTex("V = h^3", font_size=20)
        small_volume.next_to(small_label, DOWN, buff=0.2)
        
        large_label = Text("Wysokość: 2h", font_size=20, color=GREEN)
        large_label.next_to(large_cube, DOWN, buff=0.5)
        large_volume = MathTex("V = (2h)^3 = 8h^3", font_size=20)
        large_volume.next_to(large_label, DOWN, buff=0.2)
        
        self.play(
            FadeIn(small_cube),
            Write(small_label),
            Write(small_volume)
        )
        self.wait()
        
        self.play(
            FadeIn(large_cube),
            Write(large_label),
            Write(large_volume)
        )
        self.wait()
        
        # Highlight the 8x relationship
        arrow = CurvedArrow(
            small_cube.get_right() + RIGHT * 0.3,
            large_cube.get_left() + LEFT * 0.3,
            color=YELLOW
        )
        times_8 = Text("8x większa objętość!", font_size=24, color=YELLOW)
        times_8.next_to(arrow, UP, buff=0.2)
        
        self.play(
            Create(arrow),
            Write(times_8)
        )
        self.wait(2)
        
        # Clear for graph
        self.play(
            FadeOut(small_cube), FadeOut(large_cube),
            FadeOut(small_label), FadeOut(large_label),
            FadeOut(small_volume), FadeOut(large_volume),
            FadeOut(arrow), FadeOut(times_8),
            FadeOut(math_title)
        )
        
        # Create graph showing height vs weight relationship
        graph_title = Text("Wysokość vs Waga", font_size=36, color=BLUE)
        graph_title.to_edge(UP)
        self.play(Write(graph_title))
        
        # Create axes
        axes = Axes(
            x_range=[0, 10, 1],
            y_range=[0, 1000, 100],
            x_length=8,
            y_length=6,
            axis_config={
                "color": WHITE,
                "include_numbers": True,
                "font_size": 16,
            },
            tips=True,
            x_axis_config={
                "numbers_to_include": [0, 2, 4, 6, 8, 10],
            },
            y_axis_config={
                "numbers_to_include": [0, 200, 400, 600, 800, 1000],
            }
        ).shift(DOWN * 0.5)
        
        axes_labels = axes.get_axis_labels(
            x_label=Text("Wysokość (x)", font_size=20),
            y_label=Text("Waga (x³)", font_size=20)
        )
        
        self.play(Create(axes), Write(axes_labels))
        
        # Plot cubic function
        cubic_function = axes.plot(
            lambda x: x**3,
            x_range=[0, 10],
            color=GREEN,
            stroke_width=3
        )
        
        # Plot linear function for comparison
        linear_function = axes.plot(
            lambda x: 100 * x,
            x_range=[0, 10],
            color=RED,
            stroke_width=3,
            stroke_opacity=0.5
        )
        
        # Labels for functions
        cubic_label = MathTex("y = x^3", font_size=24, color=GREEN)
        cubic_label.next_to(axes.c2p(7, 343), UR)
        linear_label = MathTex("y = 100x", font_size=24, color=RED)
        linear_label.next_to(axes.c2p(9, 900), DOWN)
        
        self.play(
            Create(cubic_function),
            Create(linear_function),
            Write(cubic_label),
            Write(linear_label)
        )
        
        # Add points showing specific examples
        points_data = [(1, 1), (2, 8), (3, 27), (4, 64), (5, 125)]
        dots = []
        
        for x, y in points_data:
            dot = Dot(axes.c2p(x, y), color=YELLOW, radius=0.08)
            dots.append(dot)
            value_label = MathTex(f"{x}^3={y}", font_size=14)
            value_label.next_to(dot, UR if x < 4 else UL, buff=0.1)
            
            self.play(
                FadeIn(dot),
                Write(value_label),
                run_time=0.5
            )
        
        # Final message
        conclusion = Text(
            "Dlatego duże zwierzęta mają masywną budowę!",
            font_size=28,
            color=YELLOW
        )
        conclusion.next_to(axes, DOWN, buff=0.8)
        
        self.play(Write(conclusion))
        self.wait(3)